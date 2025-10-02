import { ReactNode } from 'react';

type Props = {
    title: string;
    children: ReactNode;
    onClose: () => void;
    onSubmit?: () => void;
    submitText?: string;
};

export default function Modal({ title, children, onClose, onSubmit, submitText = 'Save' }: Props) {
    return (
        <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">{title}</h1>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                        {onSubmit && <button type="button" className="btn btn-primary" onClick={onSubmit}>{submitText}</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}

