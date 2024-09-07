import { File, ExternalLink } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Document } from "@/types/interface.document"


export default function DocumentCard({ document }: { document: Document }) {
    const truncateName = (name: string) => {
      return name.length > 18 ? `${name.substring(0, 18)}...` : name;
    };

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <File className="h-4 w-4 text-primary" />
            {truncateName(document.name)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { label: "Professor", value: document.professor },
              { label: "Documento", value: truncateName(document.fileName) },
              { label: "Disciplina", value: truncateName(document.discipline.name) },
              { label: "Semestre", value: document.semester.name }
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <Badge variant="secondary">{label}</Badge>
                <span className="text-sm">{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full" disabled={!document.fileUrl}>
            <a href={document.fileUrl || '#'} target="_blank" rel="noopener noreferrer">
              {document.fileUrl ? 'Ver documento' : 'Documento não disponível'}
              {document.fileUrl && <ExternalLink className="ml-2 h-4 w-4" />}
            </a>
          </Button>
        </CardFooter>
      </Card>
    )
  }