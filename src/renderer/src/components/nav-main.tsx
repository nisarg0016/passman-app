import { IconCirclePlusFilled, IconKey, IconRefresh, IconEye, type Icon } from "@tabler/icons-react"
import * as React from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { vaultAdd, vaultFetch } from '@/lib/api/landing'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const newEntrySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  site: z.string().min(1, 'Website is required'),
  category: z.string().min(1, 'Category is required'),
  site_username: z.string().min(1, 'Username is required'),
  site_password: z.string().min(1, 'Password is required'),
  notes: z.string().optional(),
})

type NewEntryForm = z.infer<typeof newEntrySchema>

export function NavMain({
  items,
  setView,
  refreshVaultData
}: {
  items: {
    title: string
    url: string
    icon?: Icon,
    function?: () => void
  }[]
  setView?: (view: string) => void
  refreshVaultData?: () => void
}) {
  const [showPass, setShowPass] = React.useState('password')
  const [isQuickCreateOpen, setIsQuickCreateOpen] = React.useState(false)
  
  const form = useForm<NewEntryForm>({
    resolver: zodResolver(newEntrySchema),
    defaultValues: {
      title: '',
      site: '',
      category: '',
      site_username: '',
      site_password: '',
      notes: '',
    }
  })

  const generateStrongPassword = () => {
    const length = 16
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    form.setValue('site_password', password)
    toast.success('Strong password generated!')
  }

  const onSubmit = async (data: NewEntryForm) => {
    await vaultAdd(localStorage.getItem('username') || '', localStorage.getItem('token') || '', data).then(async () => {
      await vaultFetch(localStorage.getItem('username') || '', localStorage.getItem('token') || '').then(() => {
        toast.success('Password entry created successfully!')
        form.reset()
        if (refreshVaultData) {
          refreshVaultData()
        }
        setIsQuickCreateOpen(false)
      })
    }).catch((error) => {
      toast.error('Failed to create password entry')
    })
  }
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Dialog open={isQuickCreateOpen} onOpenChange={setIsQuickCreateOpen}>
              <DialogTrigger asChild>
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                  <IconCirclePlusFilled />
                  <span>Quick Create</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Password Entry</DialogTitle>
                  <DialogDescription>
                    Add a new password entry to your vault
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Gmail Account" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="site"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Email">Email</SelectItem>
                              <SelectItem value="Social">Social</SelectItem>
                              <SelectItem value="Finance">Finance</SelectItem>
                              <SelectItem value="Development">Development</SelectItem>
                              <SelectItem value="Entertainment">Entertainment</SelectItem>
                              <SelectItem value="Shopping">Shopping</SelectItem>
                              <SelectItem value="Work">Work</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="site_username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="site_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input type={showPass} placeholder="Enter password" {...field} />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={generateStrongPassword}
                                title="Generate strong password"
                              >
                                <IconRefresh className="size-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setShowPass(showPass === 'password' ? 'text' : 'password')}
                                title="Show Password"
                              >
                                <IconEye className="size-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Additional notes..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsQuickCreateOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        <IconKey className="size-4 mr-2" />
                        Create Entry
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={item.function}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}