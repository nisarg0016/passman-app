'use client'

import * as React from 'react'
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
    arrayMove,
    SortableContext as OriginalSortableContext,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconCircleCheckFilled,
    IconDotsVertical,
    IconGripVertical,
    IconLayoutColumns
} from '@tabler/icons-react'
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState
} from '@tanstack/react-table'

import { toast } from 'sonner'
import { z } from 'zod'

import { useIsMobile } from '@/hooks/use-mobile'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { Checkbox } from '@/components/ui/checkbox'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from '@/components/ui/drawer'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent } from '@/components/ui/tabs'

const SortableContext = OriginalSortableContext as React.ComponentType<any>

export const schema = z.object({
    id: z.number(),
    title: z.string(),
    site: z.string(),
    category: z.string(),
    site_username: z.string(),
    password_encrypted: z.string(),
    notes: z.string().optional(),
    favourite: z.boolean().optional()
})



const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
        id: 'drag',
        header: () => null,
        cell: () => (
            <div className="cursor-grab active:cursor-grabbing">
                <IconGripVertical className="text-muted-foreground size-4" />
            </div>
        )
    },
    {
        id: 'select',
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => {
            return <TableCellViewer item={row.original} />
        },
        enableHiding: false
    },
    {
        accessorKey: 'site',
        header: 'Website',
        cell: ({ row }) => (
            <div className="max-w-48 truncate">
                {row.original.site}
            </div>
        )
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
                {row.original.category}
            </Badge>
        )
    },
    {
        accessorKey: 'site_username',
        header: 'Username',
        cell: ({ row }) => (
            <div className="max-w-32 truncate">
                {row.original.site_username}
            </div>
        )
    },
    {
        id: 'password',
        header: 'Password',
        cell: () => (
            <div className="text-muted-foreground">
                ••••••••
            </div>
        )
    },
    {
        id: 'actions',
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                        size="icon"
                    >
                        <IconDotsVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Copy Password</DropdownMenuItem>
                    <DropdownMenuItem>Copy Username</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
]

function DraggableRow({ row }: { key: string, row: Row<z.infer<typeof schema>> }) {
    const { 
        transform, 
        transition, 
        setNodeRef, 
        isDragging,
        attributes,
        listeners
    } = useSortable({
        id: row.original.id
    })

    return (
        <TableRow
            data-state={row.getIsSelected() && 'selected'}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition
            }}
        >
            {row.getVisibleCells().map((cell, index) => (
                <TableCell 
                    key={cell.id}
                    {...(index === 0 ? { ...attributes, ...listeners } : {})}
                    className={index === 0 ? "cursor-grab active:cursor-grabbing" : ""}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

export function DataTable({ data: initialData }: { data: z.infer<typeof schema>[] }) {
    const [data, setData] = React.useState(() => initialData)
    
    // Sync internal data state with prop changes
    React.useEffect(() => {
        console.log('DataTable: initialData prop changed:', initialData)
        setData(initialData)
    }, [initialData])
    
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10
    })
    const sortableId = React.useId()
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 8,
            },
        }),
        useSensor(KeyboardSensor, {})
    )

    const dataIds = React.useMemo<UniqueIdentifier[]>(() => data?.map(({ id }) => id) || [], [data])

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues()
    })

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((data) => {
                const oldIndex = dataIds.indexOf(active.id)
                const newIndex = dataIds.indexOf(over.id)
                return arrayMove(data, oldIndex, newIndex)
            })
        }
    }

    return (
        <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
            <div className="flex items-center justify-between px-4 lg:px-6">
                <Label htmlFor="view-selector" className="sr-only">
                    View
                </Label>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <IconLayoutColumns />
                                <span className="hidden lg:inline">Customize Columns</span>
                                <span className="lg:hidden">Columns</span>
                                <IconChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== 'undefined' &&
                                        column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <TabsContent
                value="outline"
                className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
                <div className="overflow-hidden rounded-lg border">
                    <DndContext
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis]}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                        id={sortableId}
                    >
                        <Table>
                            <TableHeader className="bg-muted sticky top-0 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} colSpan={header.colSpan}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column.columnDef.header,
                                                              header.getContext()
                                                          )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                {table.getRowModel().rows?.length ? (
                                    <SortableContext
                                        items={dataIds}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {table.getRowModel().rows.map((row) => (
                                            <DraggableRow key={row.id} row={row} />
                                        ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} of{' '}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                    <SelectValue
                                        placeholder={table.getState().pagination.pageSize}
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="past-performance" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent value="focus-documents" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
        </Tabs>
    )
}



function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
    const isMobile = useIsMobile()
    const [showPassword, setShowPassword] = React.useState(false)
    const [copied, setCopied] = React.useState<string | null>(null)

    const copyToClipboard = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(type)
            toast.success(`${type} copied to clipboard`)
            setTimeout(() => setCopied(null), 2000)
        } catch (err) {
            toast.error(`Failed to copy ${type.toLowerCase()}`)
        }
    }

    return (
        <Drawer direction={isMobile ? 'bottom' : 'right'}>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left font-medium">
                    {item.title}
                </Button>
            </DrawerTrigger>
            <DrawerContent className={isMobile ? 'max-h-[80vh]' : 'min-w-[400px] max-w-[500px]'}>
                <DrawerHeader className="gap-2">
                    <DrawerTitle className="flex items-center gap-2">
                        {item.title}
                        {item.favourite && (
                            <Badge variant="secondary" className="text-xs">
                                Favourite
                            </Badge>
                        )}
                    </DrawerTitle>
                    <DrawerDescription className="text-left">
                        Password entry details
                    </DrawerDescription>
                </DrawerHeader>
                
                <div className="flex flex-col gap-4 px-4 py-2">
                    <div className="grid gap-3">
                        <div className="grid gap-1.5">
                            <Label className="text-sm font-medium">Website</Label>
                            <div className="flex items-center gap-2">
                                <Input 
                                    value={item.site} 
                                    readOnly 
                                    className="text-sm bg-muted/50"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(item.site, 'Website')}
                                    className="shrink-0"
                                >
                                    {copied === 'Website' ? (
                                        <IconCircleCheckFilled className="size-4" />
                                    ) : (
                                        'Copy'
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-sm font-medium">Username</Label>
                            <div className="flex items-center gap-2">
                                <Input 
                                    value={item.site_username} 
                                    readOnly 
                                    className="text-sm bg-muted/50"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(item.site_username, 'Username')}
                                    className="shrink-0"
                                >
                                    {copied === 'Username' ? (
                                        <IconCircleCheckFilled className="size-4" />
                                    ) : (
                                        'Copy'
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-sm font-medium">Password</Label>
                            <div className="flex items-center gap-2">
                                <Input 
                                    type={showPassword ? 'text' : 'password'}
                                    value={item.password_encrypted} 
                                    readOnly 
                                    className="text-sm bg-muted/50 font-mono"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="shrink-0"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(item.password_encrypted, 'Password')}
                                    className="shrink-0"
                                >
                                    {copied === 'Password' ? (
                                        <IconCircleCheckFilled className="size-4" />
                                    ) : (
                                        'Copy'
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-1.5">
                            <Label className="text-sm font-medium">Category</Label>
                            <Badge variant="outline" className="w-fit">
                                {item.category}
                            </Badge>
                        </div>

                        {item.notes && (
                            <div className="grid gap-1.5">
                                <Label className="text-sm font-medium">Notes</Label>
                                <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
                                    {item.notes}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DrawerFooter className="flex-row gap-2">
                    <Button variant="outline" className="flex-1">
                        Edit
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline" className="flex-1">
                            Close
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}