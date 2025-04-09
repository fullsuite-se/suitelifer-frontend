import TestCardComponent from "./TestCard";
const tests = [
  {
    id: 1,
    title: "Emotional Intelligence",
    description:
      "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas, las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.",
    duration: 10,
    isPrimary: true,
  },
  {
    id: 2,
    title: "Motivation",
    description:
      "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen.",
    duration: 15,
    isPrimary: false,
  },
  {
    id: 2,
    title: "Motivation",
    description:
      "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen.",
    duration: 15,
    isPrimary: false,
  },
  {
    id: 2,
    title: "Motivation",
    description:
      "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen.",
    duration: 15,
    isPrimary: false,
  },
  {
    id: 2,
    title: "Motivation",
    description:
      "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen.",
    duration: 15,
    isPrimary: false,
  },
  {
    id: 2,
    title: "Motivation",
    description:
      "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen.",
    duration: 15,
    isPrimary: false,
  },
];

export default function PersonalityTest() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* <div className="flex items-center mb-8">
        <span className="text-sm text-gray-600">Powered by</span>
        <div className="flex items-center">
          <img
            className="h-10 w-40"
            src="https://images.teamtailor-cdn.com/images/s3/teamtailor-production/gallery_picture-v6/image_uploads/6128c76c-0dc2-4240-9a50-55035ae9b531/original.svg"
            alt="TestGorilla logo"
          />
         
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-30">
        {tests.map((test) => (
          <TestCardComponent
            key={test.id}
            title={test.title}
            description={test.description}
            duration={test.duration}
            text="Go to Test"
          />
        ))}
      </div>
    </div>
  );
}
