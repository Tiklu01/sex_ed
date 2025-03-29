import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
export default function SkeletonCard() {
  return (
    <Card className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 overflow-hidden h-full">
      <CardHeader className="pb-2">
        <div className="h-6 bg-slate-700 rounded animate-pulse mb-4 w-3/4 mx-auto"></div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center">
        <div className="w-32 h-32 bg-slate-700 rounded-lg animate-pulse mb-4"></div>
        <div className="space-y-2 mt-4 w-full">
          <div className="h-4 bg-slate-700 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-slate-700 rounded animate-pulse w-full"></div>
          <div className="h-4 bg-slate-700 rounded animate-pulse w-full"></div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="h-9 bg-slate-700 rounded animate-pulse w-full"></div>
      </CardFooter>
    </Card>
  )
}