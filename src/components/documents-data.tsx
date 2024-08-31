interface DocumentDataInterface {
  name: string;
  professor: string;
  semester: string;
  discipline: string;
  fileUrl?: string;
  fileName: string;
  file?: File;
}


export default function DocumentsData({ fileUrl, fileName, name, professor, semester, discipline }: DocumentDataInterface) {
  return (
    <>
      <h3 className="font-semibold text-lg mb-2">{name}</h3>
      <p className="text-sm text-gray-600 mb-1">Professor: {professor}</p>
      <p className="text-sm text-gray-600 mb-1">Semestre: {semester}</p>
      <p className="text-sm text-gray-600 mb-1">Disciplina: {discipline}</p>
      <p className="text-sm text-gray-600 mb-1">Documento: {fileName}</p>
      {fileUrl && (
        <a href={fileUrl} className="text-sm text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          Ver documento
        </a>
      )}
    </>
  )
}