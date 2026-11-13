import React, { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdOutlineClose } from "react-icons/md";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string | number;
}

const CustomModal = ({ isOpen, onClose, children, width }: Props) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClose();
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const modalContent = isOpen ? (
    <div
      className="fixed inset-0 z-[5000] flex items-center justify-center bg-[#34405440]"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-lg w-full p-4 max-h-[calc(100%-30px)] flex flex-col"
        style={{ maxWidth: width ?? "512px", minWidth: "512px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button onClick={handleClose}>
            <MdOutlineClose className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return createPortal(modalContent, document.getElementById("modal-root")!);
  }

  return null;
};

export default CustomModal;
