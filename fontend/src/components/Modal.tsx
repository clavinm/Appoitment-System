import {
  cloneElement,
  createContext,
  useContext,
  useState,
  ReactNode,
  RefObject,
  ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
// import { HiXMark } from 'react-icons/hi2';
import { useOutsideClick } from '../hooks/useOutsideClick';
import styled, { keyframes } from 'styled-components';

const popIn = keyframes`
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const StyledModal = styled.div`
  position: relative;
  background-color: transparent;
  border-radius: 0.5rem;
  /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
  padding: 1.5rem;
  max-width: 40rem;
  width: 100%;
  animation: ${popIn} 0.2s ease;
`;

const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(4px);
  z-index: 1000;
`;

// const CloseButton = styled.button`
//   position: absolute;
//   top: 0.75rem;
//   right: 0.75rem;
//   background: none;
//   border: none;
//   padding: 0.5rem;
//   border-radius: 0.25rem;
//   color: #9ca3af;
//   z-index: 1;

//   &:hover {
//     background-color: #e5e7eb;
//     color: #374151;
//   }

//   & svg {
//     width: 1rem;
//     height: 1rem;
//   }
// `;

interface ModalContextProps {
  openModalName: string;
  closeModal: () => void;
  openModal: (name: string) => void;
}

export const ModalContext = createContext<ModalContextProps>({
  openModalName: '',
  closeModal: () => {},
  openModal: () => {},
});

interface ModalProps {
  children: ReactNode;
}

function Modal({ children }: ModalProps) {
  const [openModalName, setOpenModalName] = useState('');

  const closeModal = () => setOpenModalName('');

  const openModal = (name: string) => setOpenModalName(name);

  return (
    <ModalContext.Provider value={{ openModalName, closeModal, openModal }}>
      {children}
    </ModalContext.Provider>
  );
}

interface OpenProps {
  opens: string;
  children: ReactElement;
}

function Open({ opens, children }: OpenProps) {
  const { openModal } = useContext(ModalContext);
  return cloneElement(children, {
    onClick: () => openModal(opens),
  });
}

interface WindowProps {
  name: string;
  children: ReactElement<{ closeModal: () => void }>;
}

function Window({ name, children }: WindowProps) {
  const { openModalName, closeModal } = useContext(ModalContext);

  const ref = useOutsideClick(closeModal);

  if (name !== openModalName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref as RefObject<HTMLDivElement>}>
        <div>
          {cloneElement(children, {
            closeModal: closeModal,
          })}
        </div>
      </StyledModal>
    </Overlay>,
    document.body,
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
