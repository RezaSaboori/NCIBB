from django.urls import path
from . import views

app_name = 'credits'

urlpatterns = [
    path('', views.UserCreditView.as_view(), name='user_credit'),
    path('transactions/', views.CreditTransactionListView.as_view(), name='transaction_list'),
    path('packages/', views.CreditPackageListView.as_view(), name='package_list'),
    path('packages/<int:pk>/', views.CreditPackageDetailView.as_view(), name='package_detail'),
    path('add/', views.add_credits_view, name='add_credits'),
    path('spend/', views.spend_credits_view, name='spend_credits'),
    path('stats/', views.credit_stats_view, name='credit_stats'),
]
