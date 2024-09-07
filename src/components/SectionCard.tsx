import {  Folder } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"


export default function Section({ title, items, onItemClick }: { title: string, items: any[], onItemClick: (item: any) => void }) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <Card key={item.id} className="cursor-pointer hover:bg-accent transition-colors" onClick={() => onItemClick(item)}>
              <CardContent className="flex items-center p-4">
                <Folder className="mr-2 h-5 w-5 text-primary" />
                <span className="text-lg font-medium">{item.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }