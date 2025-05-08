import { EnvelopeIcon } from "@heroicons/react/24/solid";

export default function DevelopersPage() {
  const developers = [
    { name: "Hernani Domingo", email: "hernani.domingo.dev@gmail.com" },
    { name: "Lance Jericho Salcedo", email: "ljsalcedo.dev@gmail.com" },
    { name: "Dan Hebron Galano", email: "dan.galano.dev@gmail.com" },
    { name: "Melbraei Santiago", email: "melbraeisantiago@gmail.com" },
    { name: "Allen James Alvaro", email: "allenjalvaro@gmail.com" },
  ];

  return (
    <div className="min-h-screen bg-[#2D2D2D] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-[#0097B2] animate__animated animate__fadeIn animate__delay-1s">
          Meet the SuiteLifer Developers
        </h1>
        <p className="mt-4 text-gray-300 text-lg animate__animated animate__fadeIn animate__delay-2s">
          A creative and passionate team behind the SuiteLifer website.
        </p>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {developers.map((dev, index) => (
          <a href={`mailto:${dev.email}`} className="group no-underline">
            <div
              key={index}
              className="relative p-8 rounded-2xl text-center shadow-xs transform hover:scale-105 transition duration-500 ease-in-out group-hover:shadow-[0_8px_20px_6px_rgba(0,151,178,0.2)]
  animate__animated animate__fadeIn animate__delay-3s"
            >
              <div className="-z-2 absolute inset-0  rounded-2xl opacity-50 animate__animated animate__fadeIn animate__delay-1s"></div>
              <h2 className="text-2xl font-avenir-black text-white z-10">
                {dev.name}
              </h2>
              <div className="mt-4 z-10">
                <div className="text-[#BFD1A0] text-lg flex items-center justify-center gap-2 z-10 group-hover:text-[#0097B2] transition">
                  <EnvelopeIcon className="text-xl w-5" />
                  {dev.email}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
