import React, { ReactNode } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type TableContainerProps = {
  children: ReactNode;
};

const TableContainer = ({ children }: TableContainerProps) => {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow">{children}</div>
        </div>
      </div>
    </div>
  );
};

type TableHeaderProps = {
  headers: string[];
};

const TableHeader = ({ headers }: TableHeaderProps) => {
  return (
    <thead className="bg-gray-100 dark:bg-gray-700">
      <tr>
        {headers.map((header, index) => (
          <th
            key={index}
            scope="col"
            className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

type TableRowProps = {
  row: Record<string, ReactNode>;
  headers: string[];
  actions?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
    className: string;
  }[];
};

const TableRow = ({ row, headers, actions }: TableRowProps) => {
  return (
    <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
      {headers.map((header, index) => (
        <td
          key={index}
          className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {header === 'Name' && row['name'] && row['email'] ? (
            <div>
              <div>{row['name']}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {row['email']}
              </div>
            </div>
          ) : header === 'Status' ? (
            <div className="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
              <div className="flex items-center">
                {row['status'] === 'Verified' ? (
                  <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>
                ) : row['status'] === 'Unverified' ? (
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                ) : null}
                {row['status']}
              </div>
            </div>
          ) : (
            <div className="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
              {row['status']}
            </div>
          )}
        </td>
      ))}
      {actions && (
        <td className="p-4 space-x-2 whitespace-nowrap">
          {actions.map((action, index) => (
            <button
              key={index}
              type="button"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg ${action.className}`}
              onClick={action.onClick}
            >
              {action.icon && <action.icon className="w-4 h-4 mr-2" />}
              {action.label}
            </button>
          ))}
        </td>
      )}
    </tr>
  );
};

type TableBodyProps = {
  rows: Record<string, ReactNode>[];
  headers: string[];
  actions?: TableRowProps['actions'];
};

const TableBody = ({ rows, headers, actions }: TableBodyProps) => {
  return (
    <tbody className="bg-white dark:bg-boxdark">
      {rows.map((row, index) => (
        <TableRow key={index} row={row} headers={headers} actions={actions} />
      ))}
    </tbody>
  );
};

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="sticky bottom-0 right-0 items-center w-full p-4 bg-white border-t border-gray-200 sm:flex sm:justify-between dark:bg-boxdark">
      <div className="flex items-center mb-4 sm:mb-0">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {itemsPerPage * (currentPage - 1) + 1}-
            {Math.min(itemsPerPage * currentPage, totalItems)}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalItems}
          </span>
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          style={{ background: '#4686e5' }}
        >
          <FaChevronLeft className="w-5 h-5 mr-1 -ml-1" />
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          style={{ background: '#4686e5' }}
        >
          Next
          <FaChevronRight className="w-5 h-5 ml-1 -mr-1" />
        </button>
      </div>
    </div>
  );
};

type TableProps = {
  headers: string[];
  rows: Record<string, ReactNode>[];
  actions?: TableRowProps['actions'];
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

const Table = ({
  headers,
  rows,
  actions,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: TableProps) => {
  return (
    <TableContainer>
      <table className="min-w-full divide-y divide-gray-200 table-fixed dark:bg-boxdark">
        <TableHeader headers={headers} />
        <TableBody rows={rows} headers={headers} actions={actions} />
      </table>
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </TableContainer>
  );
};

export default Table;
