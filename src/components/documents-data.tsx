import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileIcon, ExternalLinkIcon } from "lucide-react"
import { DocumentDataInterface } from "@/types/interface.document"

export default function DocumentsData({ fileUrl, fileName, name, professor, semester, discipline }: DocumentDataInterface) {
  return (
    <>
     <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileIcon className="h-5 w-5" />
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Professor</Badge>
            <span className="text-sm">{professor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Semestre</Badge>
            <span className="text-sm">{semester}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Disciplina</Badge>
            <span className="text-sm">{discipline}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Documento</Badge>
            <span className="text-sm">{fileName}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {fileUrl ? (
          <Button asChild className="w-full">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              Ver documento
              <ExternalLinkIcon className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : (
          <Button disabled className="w-full">Documento não disponível</Button>
        )}
      </CardFooter>
    </Card>
    </>
  )
}