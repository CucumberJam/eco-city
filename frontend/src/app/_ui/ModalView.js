"use client";
import { Button, Modal } from "flowbite-react";

export function ModalView(
    {
        title = 'Сведения об участнике',
        isOpen = false,
        dismiss = true,
        handleClose = null,
        needsActions = false,
        handleAccept = null,
        titleAccept = 'Согласен',
        handleRefusal = null,
        titleRefusal = 'Не согласен',
        children
    }) {
    return (
        <>
            <Modal dismissible={dismiss}
                   show={isOpen}
                   onClose={handleClose}
                   popup={needsActions}>
                <Modal.Header>{title}</Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
                {needsActions &&
                    <Modal.Footer>
                        <Button onClick={handleAccept}>{titleAccept}</Button>
                        <Button color="gray" onClick={handleRefusal}>{titleRefusal}</Button>
                </Modal.Footer>}
            </Modal>
        </>
    );
}