import { ReactNode, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useAnnouncement } from '@/hooks/useAnnouncement';

interface ModalContextValue {
  onClose: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Modal({ isOpen, onClose, children, size = 'md', className = '' }: ModalProps) {
  const { announce } = useAnnouncement();

  const handleClose = () => {
    announce('Modal closed', { politeness: 'polite' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ onClose: handleClose }}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <ModalContent size={size} className={className}>
          {children}
        </ModalContent>
      </div>
    </ModalContext.Provider>
  );
}

interface ModalContentProps {
  size: 'sm' | 'md' | 'lg' | 'xl';
  className: string;
  children: ReactNode;
}

function ModalContent({ size, className, children }: ModalContentProps) {
  const context = useContext(ModalContext);
  if (!context) throw new Error('ModalContent must be used within Modal');

  const modalRef = useFocusTrap({
    isActive: true,
    onEscape: context.onClose,
    restoreFocus: true
  }) as React.RefObject<HTMLDivElement>;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div
      ref={modalRef}
      className={`relative bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

Modal.Header = function ModalHeader({ children, className = '' }: ModalHeaderProps) {
  const context = useContext(ModalContext);
  if (!context) throw new Error('ModalHeader must be used within Modal');

  return (
    <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${className}`}>
      <div id="modal-title" className="text-xl font-semibold text-gray-900">
        {children}
      </div>
      <button
        onClick={context.onClose}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Close modal"
      >
        <X className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  );
};

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

Modal.Body = function ModalBody({ children, className = '' }: ModalBodyProps) {
  return (
    <div className={`p-6 overflow-y-auto max-h-[60vh] ${className}`}>
      {children}
    </div>
  );
};

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

Modal.Footer = function ModalFooter({ children, className = '' }: ModalFooterProps) {
  return (
    <div className={`flex items-center justify-end gap-3 p-6 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};
