from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import UserCredit, CreditTransaction, CreditPackage
from .serializers import (
    UserCreditSerializer, 
    CreditTransactionSerializer, 
    CreditPackageSerializer,
    AddCreditsSerializer,
    SpendCreditsSerializer
)
from authentication.permissions import IsOwnerOrAdmin, CanManageUsers


class UserCreditView(generics.RetrieveAPIView):
    serializer_class = UserCreditSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    
    def get_object(self):
        credit, created = UserCredit.objects.get_or_create(user=self.request.user)
        return credit


class CreditTransactionListView(generics.ListAPIView):
    serializer_class = CreditTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['transaction_type']
    search_fields = ['description']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return CreditTransaction.objects.all()
        return CreditTransaction.objects.filter(user=self.request.user)


class CreditPackageListView(generics.ListAPIView):
    queryset = CreditPackage.objects.filter(is_active=True)
    serializer_class = CreditPackageSerializer
    permission_classes = [permissions.IsAuthenticated]


class CreditPackageDetailView(generics.RetrieveAPIView):
    queryset = CreditPackage.objects.filter(is_active=True)
    serializer_class = CreditPackageSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_credits_view(request):
    """Add credits to user's account (admin only)"""
    if request.user.role != 'admin':
        return Response(
            {"error": "Only administrators can add credits"}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = AddCreditsSerializer(data=request.data)
    if serializer.is_valid():
        user_id = request.data.get('user_id')
        if not user_id:
            return Response(
                {"error": "user_id is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from authentication.models import User
            user = User.objects.get(id=user_id)
            credit, created = UserCredit.objects.get_or_create(user=user)
            
            amount = serializer.validated_data['amount']
            description = serializer.validated_data.get('description', 'Credits added by admin')
            
            credit.add_credits(amount, description)
            
            return Response({
                "message": f"Successfully added {amount} credits to {user.get_full_name()}",
                "new_balance": str(credit.balance)
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def spend_credits_view(request):
    """Spend credits from user's account"""
    serializer = SpendCreditsSerializer(data=request.data)
    if serializer.is_valid():
        credit, created = UserCredit.objects.get_or_create(user=request.user)
        
        amount = serializer.validated_data['amount']
        description = serializer.validated_data.get('description', 'Credits spent')
        
        if credit.spend_credits(amount, description):
            return Response({
                "message": f"Successfully spent {amount} credits",
                "new_balance": str(credit.balance)
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "error": "Insufficient credits",
                "current_balance": str(credit.balance),
                "requested_amount": str(amount)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def credit_stats_view(request):
    """Get credit statistics for dashboard"""
    credit, created = UserCredit.objects.get_or_create(user=request.user)
    
    # Get recent transactions
    recent_transactions = CreditTransaction.objects.filter(
        user=request.user
    ).order_by('-created_at')[:10]
    
    # Get monthly stats
    from django.utils import timezone
    from datetime import timedelta
    
    now = timezone.now()
    last_month = now - timedelta(days=30)
    
    monthly_earned = CreditTransaction.objects.filter(
        user=request.user,
        transaction_type='earned',
        created_at__gte=last_month
    ).aggregate(total=models.Sum('amount'))['total'] or 0
    
    monthly_spent = CreditTransaction.objects.filter(
        user=request.user,
        transaction_type='spent',
        created_at__gte=last_month
    ).aggregate(total=models.Sum('amount'))['total'] or 0
    
    return Response({
        'balance': str(credit.balance),
        'total_earned': str(credit.total_earned),
        'total_spent': str(credit.total_spent),
        'monthly_earned': str(monthly_earned),
        'monthly_spent': str(monthly_spent),
        'recent_transactions': CreditTransactionSerializer(recent_transactions, many=True).data
    })