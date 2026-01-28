import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import { Trash2, MapPin, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Checkout = () => {
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newAddress, setNewAddress] = useState({
    address: "",
    phone: "",
  });

  const [modalOpen, setModalOpen] = useState(false);

  // delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  // ================= GET ADDRESS =================
  const getAddress = async () => {
    try {
      const { data } = await axios.get(`${server}/api/address/all`, {
        headers: { token: Cookies.get("token") },
      });

      setAddress(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // ================= VALIDATION =================
  const isPhoneValid = /^[0-9]{10}$/.test(newAddress.phone);
  const isFormValid = newAddress.address.trim().length > 5 && isPhoneValid;

  // ================= ADD ADDRESS =================
  const handleAddAddress = async () => {
    if (!isFormValid) {
      toast.error("Please enter valid address & 10-digit phone number");
      return;
    }

    try {
      const { data } = await axios.post(
        `${server}/api/address/new`,
        {
          address: newAddress.address.trim(),
          phone: newAddress.phone,
        },
        {
          headers: { token: Cookies.get("token") },
        }
      );

      toast.success(data.message || "Address added successfully");

      setNewAddress({ address: "", phone: "" });
      setModalOpen(false);
      getAddress();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  // ================= DELETE ADDRESS =================
  const confirmDelete = async () => {
    try {
      const { data } = await axios.delete(`${server}/api/address/${deleteId}`, {
        headers: { token: Cookies.get("token") },
      });

      toast.success(data.message || "Address deleted");
      setDeleteId(null);
      getAddress();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Select Delivery Address
        </h1>

        {loading ? (
          <Loading />
        ) : address.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {address.map((e) => (
              <div
                key={e._id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-2">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">{e.address}</p>
                      <p className="text-sm text-muted-foreground">
                        Phone: {e.phone}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-500/10"
                    onClick={() => setDeleteId(e._id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>

                <Link to={`/payment/${e._id}`}>
                  <Button className="w-full rounded-xl">
                    Use This Address
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No address found. Please add one.
          </p>
        )}

        {/* ADD ADDRESS BUTTON */}
        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            className="rounded-xl flex gap-2"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </Button>
        </div>

        {/* ADD ADDRESS MODAL */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Full Address"
                value={newAddress.address}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    address: e.target.value,
                  })
                }
              />

              <Input
                type="tel"
                placeholder="10-digit Phone Number"
                maxLength={10}
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    phone: e.target.value.replace(/\D/g, ""),
                  })
                }
              />

              {!isPhoneValid && newAddress.phone.length > 0 && (
                <p className="text-sm text-red-500">
                  Phone number must be exactly 10 digits
                </p>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button disabled={!isFormValid} onClick={handleAddAddress}>
                Save Address
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DELETE CONFIRM MODAL */}
        <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Address?</DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this address? This action cannot
              be undone.
            </p>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Checkout;
