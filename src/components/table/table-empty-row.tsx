export interface TableEmptyRowProps {
  colSpan: number;
  message: string;
}

export function TableEmptyRow({ colSpan, message }: TableEmptyRowProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-10 text-center text-sm text-cantabria-muted"
      >
        {message}
      </td>
    </tr>
  );
}
