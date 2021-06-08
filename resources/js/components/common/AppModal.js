import React from 'react';
import Modal from 'react-modal';

const customStyles = {
    content: {
      top: "35%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

export const AppModal = ({ openModal, closeModal, isOpen, orderData, ...rest }) => {

    return (
        <div>
          <Modal
            isOpen={isOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
            ariaHideApp={false}
          >

            <button onClick={closeModal}>close</button>
            <div>
                {/* {orderData && orderData.map(el => <p>{el}</p>)} */}
                {orderData && orderData.orderName}
            </div>
          </Modal>
        </div>
      );
}
