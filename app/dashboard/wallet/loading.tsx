import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function WalletLoading() {
  return (
    <div className="container py-6">
      <Skeleton className="h-10 w-48 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-36" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-10 w-[48%]" />
            <Skeleton className="h-10 w-[48%]" />
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <Skeleton className="h-6 w-6 mr-3 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-40 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Skeleton className="h-10 w-full md:w-48" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <div className="p-4">
              <div className="flex border-b pb-2 mb-4">
                <Skeleton className="h-5 w-24 mr-4" />
                <Skeleton className="h-5 w-48 mr-4" />
                <Skeleton className="h-5 w-24 mr-4" />
                <Skeleton className="h-5 w-24 mr-4" />
                <Skeleton className="h-5 w-24" />
              </div>

              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex py-3 border-b last:border-0">
                  <Skeleton className="h-5 w-24 mr-4" />
                  <Skeleton className="h-5 w-48 mr-4" />
                  <Skeleton className="h-5 w-24 mr-4" />
                  <Skeleton className="h-5 w-24 mr-4" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
