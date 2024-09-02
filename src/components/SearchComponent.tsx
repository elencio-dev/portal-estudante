import { Input } from "./ui/input";

export default function SearchComponent({ handleSearch }: any) {
  return (
    <>
      <Input
        type="search"
        placeholder="Buscar documentos..."
        className="max-w-md"
        onChange={handleSearch}
      />
    </>
  )
}