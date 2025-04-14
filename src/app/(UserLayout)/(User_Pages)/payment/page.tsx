'use client';
import CheckoutButton from '../../components/CheckoutButton';
import { CheckCircle } from '@mui/icons-material';

export default function PricingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#0d47a1' }}>
          Bank of Nova Premium
        </h1>
        <p style={{ fontSize: '1rem', color: '#444', marginBottom: '1.5rem' }}>
          Unlock unlimited transactions and more features.
        </p>

        <div style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#0d47a1',
          marginBottom: '0.5rem',
        }}>
          $16.99/mo <span style={{ fontSize: '1rem', fontWeight: 400 }}>*</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1.5rem' }}>
          *with the Value Program
        </p>

        <ul style={{ textAlign: 'left', marginBottom: '2rem' }}>
          {[
            'Unlimited debit transactions in Canada',
            'Up to $48 rebate on credit card fees',
            'FREE Interac e-Transfers',
          ].map((feature, index) => (
            <li key={index} style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.75rem',
              color: '#333',
            }}>
              <CheckCircle style={{ color: '#4caf50', marginRight: '8px' }} />
              {feature}
            </li>
          ))}
        </ul>

        <CheckoutButton />
      </div>
    </div>
  );
}
