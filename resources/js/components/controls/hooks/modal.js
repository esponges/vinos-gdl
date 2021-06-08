import React, { useState } from 'react'

export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [orderData, setOrderData] = useState(null);

    const openModal = ( data = null ) => {
        setIsOpen(true);
        setOrderData(data);
        console.log(data);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    return { openModal, isOpen, closeModal, setIsOpen, orderData };
}

