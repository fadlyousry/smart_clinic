// components/ui/dialog.jsx
import { useEffect } from 'react';

export function Dialog({ open, onOpenChange, children }) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    if (!open) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onOpenChange(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 bg-gray-500/50  flex items-center justify-center p-4 "
            onClick={handleBackdropClick}
        >
            {children}
        </div>
    );
}

export function DialogContent({ children, className = "", ...props }) {
    return (
        <div 
            className={`bg-white rounded-lg shadow-xl ${className}`} 
            onClick={(e) => e.stopPropagation()}
            {...props}
        >
            {children}
        </div>
    );
}

export function DialogHeader({ children, className = "", ...props }) {
    return (
        <div className={`p-6 pb-4 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function DialogTitle({ children, className = "", ...props }) {
    return (
        <h2 className={`text-lg font-semibold ${className}`} {...props}>
            {children}
        </h2>
    );
}

export function DialogClose({ children, asChild = false, ...props }) {
    if (asChild) {
        return children;
    }
    
    return (
        <button {...props}>
            {children}
        </button>
    );
}