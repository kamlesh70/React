import { useQuery } from "@tanstack/react-query"

type Props = {
  queryKey: [any],
  queryFn: () => Promise<any>
}

export const useCustomQuery = ({
  queryKey,
  queryFn
} : Props) => {
  const { data, isError, isLoading, error } = useQuery({
    queryKey,
    queryFn
  })

  return {
    data,
    isLoading,
    isError,
    error
  }
}