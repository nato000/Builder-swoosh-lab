import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, X, Edit2, Check, ChevronDown } from "lucide-react";
import { Procedure, Product, SoldProduct } from "@/types";
import { cn } from "@/lib/utils";

type Item = Procedure | Product | SoldProduct;

interface ProcedureModalProps<T extends Item> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: T[];
  onItemsChange: (items: T[]) => void;
  suggestions?: string[];
}

export function ProcedureModal<T extends Item>({
  isOpen,
  onClose,
  title,
  items,
  onItemsChange,
  suggestions = [],
}: ProcedureModalProps<T>) {
  const [newItemName, setNewItemName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Filtered suggestions based on current input
  const filteredSuggestions = useMemo(() => {
    if (!newItemName) return suggestions;
    return suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(newItemName.toLowerCase()),
    );
  }, [suggestions, newItemName]);

  const addItem = () => {
    if (!newItemName.trim()) return;

    const newItem = {
      id: crypto.randomUUID(),
      name: newItemName.trim(),
      createdAt: new Date().toISOString(),
    } as T;

    onItemsChange([...items, newItem]);
    setNewItemName("");
    setIsPopoverOpen(false);
  };

  const startEditing = (item: T) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const saveEdit = () => {
    if (!editingName.trim() || !editingId) return;

    const updatedItems = items.map((item) =>
      item.id === editingId ? { ...item, name: editingName.trim() } : item,
    );

    onItemsChange(updatedItems);
    setEditingId(null);
    setEditingName("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    onItemsChange(updatedItems);
  };

  const selectSuggestion = (suggestion: string) => {
    setNewItemName(suggestion);
    setIsPopoverOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Add new {title.toLowerCase().slice(0, -1)}</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative">
                      <Input
                        placeholder={`Enter ${title.toLowerCase().slice(0, -1)} name...`}
                        value={newItemName}
                        onChange={(e) => {
                          setNewItemName(e.target.value);
                          setIsPopoverOpen(e.target.value.length > 0);
                        }}
                        onKeyPress={handleKeyPress}
                        className="pr-8"
                      />
                      {filteredSuggestions.length > 0 && newItemName && (
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </PopoverTrigger>
                  {filteredSuggestions.length > 0 && newItemName && (
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandEmpty>No suggestions found.</CommandEmpty>
                        <CommandGroup>
                          {filteredSuggestions.map((suggestion, index) => (
                            <CommandItem
                              key={index}
                              onSelect={() => selectSuggestion(suggestion)}
                            >
                              {suggestion}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  )}
                </Popover>
              </div>
              <Button onClick={addItem} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {items.length > 0 && (
            <div className="space-y-2">
              <Label>Current {title.toLowerCase()}</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyPress={handleEditKeyPress}
                          className="flex-1"
                          autoFocus
                        />
                        <Button onClick={saveEdit} size="sm" variant="ghost">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button onClick={cancelEdit} size="sm" variant="ghost">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 text-sm">{item.name}</span>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => startEditing(item)}
                            size="sm"
                            variant="ghost"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => removeItem(item.id)}
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
