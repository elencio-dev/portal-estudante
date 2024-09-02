import { Input } from "./ui/input";
import { PlusIcon, SearchIcon } from "lucide-react"

export default function SearchComponent({ handleSearch }: any) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 w-full">
      <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          className="pl-8 w-full"
          placeholder="Buscar documentos..."
          onChange={handleSearch}
        />
      </div>
    </div>
  )
}