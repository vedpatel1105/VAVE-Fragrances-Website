import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Address } from "@/src/lib/profileService"
import { useToast } from "@/components/ui/use-toast"

interface AddAddressModalProps {
  onAddAddress: (address: Omit<Address, 'id' | 'created_at'>) => Promise<void>
  onUpdateAddress?: (id: string, address: Partial<Omit<Address, 'id' | 'user_id' | 'created_at'>>) => Promise<void>
  userId: string
  editAddress?: Address
  isEdit?: boolean
}

export function AddAddressModal({ onAddAddress, onUpdateAddress, userId, editAddress, isEdit = false }: AddAddressModalProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [address, setAddress] = useState({
    type: "Home",
    address: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
    user_id: userId
  })

  useEffect(() => {
    if (editAddress) {
      setAddress({
        type: editAddress.type,
        address: editAddress.address,
        city: editAddress.city,
        state: editAddress.state,
        pincode: editAddress.pincode,
        is_default: editAddress.is_default,
        user_id: userId
      })
    }
  }, [editAddress, userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && editAddress && onUpdateAddress) {
        await onUpdateAddress(editAddress.id, {
          type: address.type,
          address: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          is_default: address.is_default
        })
        toast({
          title: "Success",
          description: "Address updated successfully"
        })
      } else {
        await onAddAddress(address)
        toast({
          title: "Success",
          description: "Address added successfully"
        })
      }
      setOpen(false)
      setAddress({
        type: "Home",
        address: "",
        city: "",
        state: "",
        pincode: "",
        is_default: false,
        user_id: userId
      })
    } catch (error) {
      console.error("Error handling address:", error)
      toast({
        title: "Error",
        description: isEdit ? "Failed to update address" : "Failed to add address",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full mt-2">
          {isEdit ? "Edit Address" : "+ Add New Address"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Address" : "Add New Address"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update your shipping address." : "Add a new shipping address for your orders."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Address Type</Label>
              <Select
                value={address.type}
                onValueChange={(value) => setAddress({ ...address, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={address.address}
                onChange={(e) => setAddress({ ...address, address: e.target.value })}
                placeholder="Enter your street address"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                placeholder="Enter your city"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                placeholder="Enter your state"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pincode">PIN Code</Label>
              <Input
                id="pincode"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                placeholder="Enter your PIN code"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_default"
                checked={address.is_default}
                onChange={(e) => setAddress({ ...address, is_default: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_default">Set as default address</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{isEdit ? "Update Address" : "Add Address"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 