from django.db import models
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()


class UserCredit(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='credits')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total_earned = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    total_spent = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_credits'
        verbose_name = 'User Credit'
        verbose_name_plural = 'User Credits'
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.balance} credits"
    
    def add_credits(self, amount, description="Credit added"):
        """Add credits to user's balance"""
        self.balance += amount
        self.total_earned += amount
        self.save()
        
        # Create transaction record
        CreditTransaction.objects.create(
            user=self.user,
            amount=amount,
            transaction_type='earned',
            description=description
        )
    
    def spend_credits(self, amount, description="Credit spent"):
        """Spend credits from user's balance"""
        if self.balance >= amount:
            self.balance -= amount
            self.total_spent += amount
            self.save()
            
            # Create transaction record
            CreditTransaction.objects.create(
                user=self.user,
                amount=amount,
                transaction_type='spent',
                description=description
            )
            return True
        return False


class CreditTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('earned', 'Credit Earned'),
        ('spent', 'Credit Spent'),
        ('bonus', 'Bonus Credit'),
        ('refund', 'Refund'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='credit_transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    description = models.TextField()
    reference_id = models.CharField(max_length=100, blank=True)  # For external references
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'credit_transactions'
        verbose_name = 'Credit Transaction'
        verbose_name_plural = 'Credit Transactions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.transaction_type} - {self.amount}"


class CreditPackage(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    credits = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'credit_packages'
        verbose_name = 'Credit Package'
        verbose_name_plural = 'Credit Packages'
        ordering = ['price']
    
    def __str__(self):
        return f"{self.name} - {self.credits} credits for ${self.price}"