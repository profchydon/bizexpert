import { useCreateMcpCredentialMutation } from "@/api/baseQueries/companiesApi/mcpCredentialsApi/createMcpCredential";
import { useListMcpCredentialsQuery } from "@/api/baseQueries/companiesApi/mcpCredentialsApi/listMcpCredentials";
import { useRevokeMcpCredentialMutation } from "@/api/baseQueries/companiesApi/mcpCredentialsApi/revokeMcpCredential";
import CopyInput from "@/components/CopyInput";
import PageState from "@/components/PageState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IMcpCredential,
  IMcpCredentialWithSecret,
  McpEnvironment,
  McpScope,
} from "@/types/mcpCredential";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { KeyRound, Plus, Trash2, TriangleAlert } from "lucide-react";
import { useState } from "react";

const SCOPE_OPTIONS: { value: McpScope; label: string; hint: string }[] = [
  {
    value: "mcp:read",
    label: "Read",
    hint: "Read assets, orders, identity and transactions",
  },
  {
    value: "mcp:transact",
    label: "Transact",
    hint: "Initiate transactions and other write actions",
  },
];

const maskClientId = (clientId: string) =>
  clientId.length > 16
    ? `${clientId.slice(0, 11)}…${clientId.slice(-4)}`
    : clientId;

interface McpCredentialsProps {
  environment: McpEnvironment;
}

const McpCredentials: React.FC<McpCredentialsProps> = ({ environment }) => {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = company?.id as string;

  const {
    data: listRes,
    isLoading,
    isError,
  } = useListMcpCredentialsQuery(
    { companyId, environment },
    { skip: !companyId },
  );

  const credentials = (listRes?.data ?? []) as IMcpCredential[];

  const [createCredential, { isLoading: isCreating }] =
    useCreateMcpCredentialMutation();
  const [revokeCredential, { isLoading: isRevoking }] =
    useRevokeMcpCredentialMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState<McpScope[]>([
    "mcp:read",
    "mcp:transact",
  ]);
  const [issued, setIssued] = useState<IMcpCredentialWithSecret | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<IMcpCredential | null>(null);

  const toggleScope = (scope: McpScope) => {
    setScopes((current) =>
      current.includes(scope)
        ? current.filter((value) => value !== scope)
        : [...current, scope],
    );
  };

  const resetCreateForm = () => {
    setName("");
    setScopes(["mcp:read", "mcp:transact"]);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      return displayErrorMessage(
        "Name required",
        "Give this credential a name.",
      );
    }
    if (scopes.length === 0) {
      return displayErrorMessage(
        "Scope required",
        "Select at least one scope.",
      );
    }

    await createCredential({
      companyId,
      name: name.trim(),
      environment,
      scopes,
    })
      .unwrap()
      .then((res) => {
        setIsCreateOpen(false);
        resetCreateForm();
        setIssued(res.data);
        displaySuccessMessage(
          "MCP credential created",
          "Copy the client secret now — it won't be shown again.",
        );
      })
      .catch((error) => {
        displayErrorMessage(
          "Could not create credential",
          error?.data?.message ?? "Please try again.",
        );
      });
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;

    await revokeCredential({ companyId, credentialId: revokeTarget.id })
      .unwrap()
      .then(() => {
        displaySuccessMessage(
          "Credential revoked",
          `${revokeTarget.name} can no longer mint tokens.`,
        );
        setRevokeTarget(null);
      })
      .catch((error) => {
        displayErrorMessage(
          "Could not revoke credential",
          error?.data?.message ?? "Please try again.",
        );
      });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-start justify-between gap-4">
        <p className="text-sm text-gray-500">
          Client ID / secret pairs for headless agents (CLI bots, OpenClaw,
          server-side automation). Exchange them at the OAuth token endpoint for
          a short-lived access token using the{" "}
          <span className="font-medium">client_credentials</span> grant.
        </p>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            resetCreateForm();
            setIsCreateOpen(true);
          }}
          className="flex flex-row items-center gap-2 shrink-0"
          data-testid="mcpcredentials-button"
        >
          <Plus size={16} />
          Generate credential
        </Button>
      </div>

      <PageState isLoading={isLoading} isError={isError}>
        {credentials.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-gray-300 rounded-lg py-10 text-center">
            <KeyRound className="w-7 h-7 text-gray-400" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-900">
                No {environment} MCP credentials yet
              </span>
              <span className="text-sm text-gray-500">
                Generate one to connect a headless agent to the Rayda MCP
                server.
              </span>
            </div>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Scopes</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credentials.map((credential) => (
                  <TableRow key={credential.id}>
                    <TableCell className="font-medium text-gray-900">
                      {credential.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">
                      {maskClientId(credential.client_id)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row flex-wrap gap-1">
                        {credential.scopes.map((scope) => (
                          <Badge key={scope} variant="blue">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setRevokeTarget(credential)}
                        className="text-error-600 hover:text-error-700 inline-flex items-center gap-1"
                        data-testid="mcpcredentials-button-2"
                      >
                        <Trash2 size={14} />
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </PageState>

      <Dialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        data-testid="mcpcredentials-dialog"
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate {environment} MCP credential</DialogTitle>
            <DialogDescription>
              Name this credential and choose the scopes it can mint.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mcp-credential-name">Name</Label>
              <Input
                id="mcp-credential-name"
                placeholder="e.g. CI automation bot"
                value={name}
                onChange={(event) => setName(event.target.value)}
                data-testid="mcpcredentials-input"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Scopes</Label>
              {SCOPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex flex-row items-start gap-3 border border-gray-200 rounded-lg p-3 cursor-pointer"
                >
                  <Checkbox
                    checked={scopes.includes(option.value)}
                    onCheckedChange={() => toggleScope(option.value)}
                    className="mt-0.5"
                    data-testid="mcpcredentials-checkbox"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {option.label}{" "}
                      <span className="font-mono text-xs text-gray-500">
                        ({option.value})
                      </span>
                    </span>
                    <span className="text-xs text-gray-500">{option.hint}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              disabled={isCreating}
              data-testid="mcpcredentials-button-3"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={isCreating}
              data-testid="mcpcredentials-button-4"
            >
              {isCreating ? "Generating…" : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!issued}
        onOpenChange={(open) => {
          if (!open) setIssued(null);
        }}
        data-testid="mcpcredentials-dialog-2"
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Credential created</DialogTitle>
            <DialogDescription>
              Store these somewhere safe. Your client secret is shown only once.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-row items-start gap-3 bg-warning-25 border border-warning-300 p-3 rounded-md">
            <TriangleAlert className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
            <p className="text-sm text-warning-700">
              We do not store the secret in plain text. If you lose it, revoke
              this credential and generate a new one.
            </p>
          </div>

          <div className="flex flex-col gap-3 py-1">
            <div className="flex flex-col gap-1.5">
              <Label>Client ID</Label>
              <CopyInput
                value={issued?.client_id ?? ""}
                onChange={() => {}}
                disabled
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Client secret</Label>
              <CopyInput
                value={issued?.client_secret ?? ""}
                onChange={() => {}}
                disabled
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => setIssued(null)}
              data-testid="mcpcredentials-button-5"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!revokeTarget}
        onOpenChange={(open) => {
          if (!open) setRevokeTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke this credential?</AlertDialogTitle>
            <AlertDialogDescription>
              {revokeTarget?.name} will immediately stop being able to mint
              access tokens. Any agent using it will lose access. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleRevoke();
              }}
              disabled={isRevoking}
              className="bg-error-500 hover:bg-error-500/90"
            >
              {isRevoking ? "Revoking…" : "Revoke"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default McpCredentials;
