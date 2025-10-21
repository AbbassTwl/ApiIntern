import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  currentPage: number;
  totalPages: number;               
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1 && currentPage <= 1) return null; 

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="mt-4 flex justify-center">
      <ShadcnPagination>
        <PaginationContent className="flex items-center gap-4">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (canPrev) onPageChange(currentPage - 1);
              }}
              className={`px-3 py-2 rounded ${canPrev ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"}`}
            />
          </PaginationItem>

          {/*  show current page only */}
          <PaginationItem className="px-3 py-2 text-sm text-gray-700 font-medium">
            Page {currentPage}
          </PaginationItem>

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (canNext) onPageChange(currentPage + 1);
              }}
              className={`px-3 py-2 rounded ${canNext ? "hover:bg-gray-100" : "opacity-50 cursor-not-allowed"}`}
            />
          </PaginationItem>
        </PaginationContent>
      </ShadcnPagination>
    </div>
  );
}
