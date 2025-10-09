import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-100">
          <h6 className="font-semibold">حدث خطأ</h6>
          <p>فشل في عرض تفاصيل الموعد. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.</p>
        </div>
      );
    }
    return this.props.children;
  }
}