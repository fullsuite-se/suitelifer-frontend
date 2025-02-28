import React, { Fragment } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
} from "@headlessui/react";
import { Carousel } from "@material-tailwind/react";

const ViewFullImages = ({ images, viewFull, handleViewFull }) => {
  const handleCancel = () => {
    handleViewFull();
  };

  return (
    <Transition appear show={viewFull} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleViewFull}>
        <div
          className="fixed inset-0 bg-black opacity-40"
          onClick={handleCancel}
        />

        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-5xl p-6 overflow-hidden text-left align-middle transition-all transform bg-transparent rounded-xl">
              <div className="flex justify-between">
                <main className="mx-auto">
                  <Carousel className="rounded-xl">
                    {images.map((image, index) => (
                      <img
                        key={index}
                        src={image} // Fix: Change from images to image
                        className="w-full h-full object-fill rounded-lg"
                        alt={`image-${index}`}
                      />
                    ))}
                  </Carousel>
                </main>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ViewFullImages;
