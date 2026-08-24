import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEmpAttested } from "../../employee/hooks/useEmpAttested";
import { useEmpInfo } from "../../employee/hooks/useEmpInfo";
import { useITItemsByLocation } from "../hooks/useITItemstByLocation";
import { useMaintItemsByLocation } from "../hooks/useMainItemstByLocation";
import { toUpperStr } from "../../../utils/formatting";
import type { Item } from "../../../types/Item";
import { useItemByAssetTag } from "../hooks/useItemByAssetTag";
import { useUpdateInventory } from "../hooks/useUpdateInventory";

import { createInventoryPrintHtml } from "../../../print/inventoryPrintTemplate";

import Toast from "../../../utils/Toast";

function VerificationCard({
  item,
  onClose,
}: {
  item: Item;
  onClose: () => void;
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 100,

        width: 280,
        p: 2.5,

        background:
          "linear-gradient(145deg, rgba(248, 250, 252, 0.98), rgba(240, 253, 250, 0.98))",

        backdropFilter: "blur(10px)",

        borderRadius: 3,
        border: "1px solid #25aa25",

        boxShadow: "0 12px 35px rgba(15, 23, 42, 0.18)",

        animation: "verificationSlideIn 0.2s ease-out",

        "@keyframes verificationSlideIn": {
          from: {
            opacity: 0,
            transform: "translateY(-10px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      {/* ================= HEADER ================= */}

      {/* Close Button */}
      <Button
        onClick={onClose}
        aria-label="Close verification"
        sx={{
          position: "absolute",
          top: 10,
          right: 10,

          minWidth: 28,
          width: 28,
          height: 28,
          p: 0,

          borderRadius: "50%",

          color: "#64748b",
          fontSize: "1.1rem",
          lineHeight: 1,

          backgroundColor: "#ffffff",
          border: "1px solid #cbd5e1",

          boxShadow: "0 2px 6px rgba(15, 23, 42, 0.08)",

          "&:hover": {
            backgroundColor: "#f1f5f9",
            color: "#e92020",
            borderColor: "#94a3b8",
          },
        }}
      >
        ×
      </Button>

      <Box
        sx={{
          pb: 1.75,
          mb: 1.75,
          borderBottom: "1px solid #dbe4ea",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.68rem",
            fontWeight: 800,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            mb: 0.4,
          }}
        >
          Verified By
        </Typography>

        <Typography
          sx={{
            fontWeight: 700,
            color: "#334155",
            fontSize: "0.9rem",
          }}
        >
          {item.verified_by || "N/A"}
        </Typography>
      </Box>

      {/* ================= VERIFIED AT ================= */}
      <Box>
        <Typography
          sx={{
            fontSize: "0.68rem",
            fontWeight: 800,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            mb: 0.4,
          }}
        >
          Verified At
        </Typography>

        <Typography
          sx={{
            fontWeight: 700,
            color: "#334155",
            fontSize: "0.85rem",
          }}
        >
          {item.verif_time
            ? new Date(item.verif_time.replace(" ", "T")).toLocaleString()
            : "N/A"}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Inventory() {
  const [toast, setToast] = React.useState<{
    open: boolean;
    msg: string;
    sev: "error" | "success" | "info" | "warning";
  } | null>(null);

  const { data: isAttested } = useEmpAttested();

  const { data: employeeInfo } = useEmpInfo();

  const { data: allITInventoryData } = useITItemsByLocation();
  console.log(allITInventoryData);
  const [itInventory, setItInventory] = React.useState<Item[]>([]);
  const [confirmedITInventory, setConfirmedITInventory] = React.useState<
    Item[]
  >([]);

  React.useEffect(() => {
    if (Array.isArray(allITInventoryData)) {
      setItInventory(allITInventoryData);

      setConfirmedITInventory(
        allITInventoryData.filter((item) => item.isThere === true),
      );
    }
  }, [allITInventoryData]);

  // React.useEffect(() => {
  //   console.log("confirmedITInventory updated:", confirmedITInventory);
  // }, [confirmedITInventory]);

  const { data: allMaintInventoryData } = useMaintItemsByLocation();
  const [maintInventory, setMaintInventory] = React.useState<Item[]>([]);
  const [confirmedMaintInventory, setConfirmedMaintInventory] = React.useState<
    Item[]
  >([]);

  React.useEffect(() => {
    if (Array.isArray(allMaintInventoryData)) {
      setMaintInventory(allMaintInventoryData);

      setConfirmedMaintInventory(
        allMaintInventoryData.filter((item) => item.isThere === true),
      );
    }
  }, [allMaintInventoryData]);

  // React.useEffect(() => {
  //   console.log("confirmedMaintInventory updated:", confirmedMaintInventory);
  // }, [confirmedMaintInventory]);

  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null);

  const [selectedInventory, setSelectedInventory] = React.useState<
    "it" | "maintenance" | null
  >(null);

  const itInvCol: GridColDef<Item>[] = [
    { field: "itemID", headerName: "ID", width: 100 },
    { field: "tag_no", headerName: "Tag Number", width: 350 },
    {
      field: "description",
      headerName: "Description",
      width: 550,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "#334155",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.mfgr}
          </Typography>

          <Typography sx={{ color: "#94a3b8" }}>•</Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#475569",
              whiteSpace: "nowrap",
            }}
          >
            <strong>Model:</strong> {params.row.model}
          </Typography>

          <Typography sx={{ color: "#94a3b8" }}>•</Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#475569",
              whiteSpace: "nowrap",
            }}
          >
            <strong>Type:</strong> {params.row.type}
          </Typography>
        </Box>
      ),
    },
    {
      field: "isThere",
      headerName: "Item Confirmed",
      width: 150,

      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isConfirmed = confirmedITInventory.some(
          (item) => item.itemID === params.row.itemID,
        );

        return (
          <Checkbox
            checked={isConfirmed}
            onChange={(event) => {
              const checked = event.target.checked;
              const item = params.row as Item;

              setConfirmedITInventory((prev) => {
                if (checked) {
                  if (prev.some((x) => x.itemID === item.itemID)) {
                    return prev;
                  }

                  return [...prev, { ...item, isThere: true }];
                }

                return prev.filter((x) => x.itemID !== item.itemID);
              });
            }}
          />
        );
      },
    },
  ];
  const maintInvCol: GridColDef<Item>[] = [
    { field: "itemID", headerName: "ID", width: 100 },
    { field: "tag_no", headerName: "Tag Number", width: 350 },
    {
      field: "description",
      headerName: "Description",
      width: 550,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "#334155",
              whiteSpace: "nowrap",
            }}
          >
            {params.row.mfgr}
          </Typography>

          <Typography sx={{ color: "#94a3b8" }}>•</Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#475569",
              whiteSpace: "nowrap",
            }}
          >
            <strong>Model:</strong> {params.row.model}
          </Typography>

          <Typography sx={{ color: "#94a3b8" }}>•</Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#475569",
              whiteSpace: "nowrap",
            }}
          >
            <strong>Type:</strong> {params.row.type}
          </Typography>
        </Box>
      ),
    },
    {
      field: "isThere",
      headerName: "Item Confirmed",
      width: 150,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",

      renderCell: (params) => {
        const isConfirmed = confirmedMaintInventory.some(
          (item) => item.itemID === params.row.itemID,
        );

        return (
          <Checkbox
            checked={isConfirmed}
            onChange={(event) => {
              const checked = event.target.checked;
              const item = params.row as Item;

              setConfirmedMaintInventory((prev) => {
                if (checked) {
                  if (prev.some((x) => x.itemID === item.itemID)) {
                    return prev;
                  }

                  return [...prev, { ...item, isThere: true }];
                }

                return prev.filter((x) => x.itemID !== item.itemID);
              });
            }}
          />
        );
      },
    },
  ];

  const [onCompleteOpen, setOnCompleteOpen] = React.useState<boolean>(false);

  const onCompleteClose = () => setOnCompleteOpen(false);

  const confirmRef = React.useRef("");
  // const { mutate: updateInventory, isPending } = useUpdateInventory();

  const updateMutation = useUpdateInventory();

  const finalConfirm = async () => {
    if (confirmRef.current.trim().toLowerCase() !== "attested") {
      return;
    }

    const payload: Item[][] = [confirmedITInventory, confirmedMaintInventory];

    try {
      const result = await updateMutation.mutateAsync(payload);

      console.log("Inventory updated:", result);

      setOnCompleteOpen(false);

      // Reload after successful update
      window.location.reload();
    } catch (error) {
      console.error("Failed to update inventory:", error);
    }
  };

  const searchInventoryRef = React.useRef("");
  const [searchTag, setSearchTag] = React.useState("");

  const { data: searchedTag, isFetching: isSearching } =
    useItemByAssetTag(searchTag);

  const [searchInput, setSearchInput] = React.useState("");

  const handleSearch = () => {
    const tag = searchInventoryRef.current.trim().toUpperCase();
    if (tag === "") {
      setToast({ open: true, msg: "Enter the tag number!", sev: "error" });
      return;
    }

    setSearchTag(tag);
    setSearchInput("");
    searchInventoryRef.current = "";

    // search logic
  };

  React.useEffect(() => {
    if (!searchTag || isSearching) {
      return;
    }

    if (!searchedTag) {
      setToast({
        open: true,
        msg: "Tag not found!",
        sev: "error",
      });
      return;
    }

    if (searchedTag.tag_no?.toUpperCase().startsWith("A")) {
      setToast({
        open: true,
        msg: "Tag found in Maintenance Inventory!",
        sev: "success",
      });
    } else {
      setToast({
        open: true,
        msg: "Tag found in IT inventory!",
        sev: "success",
      });
    }

    const tag = searchedTag.tag_no?.toUpperCase();

    if (!tag) {
      return;
    }

    const itemWithConfirmed = {
      ...searchedTag,
      isThere: true as const,
    } as Item;

    if (tag.startsWith("A")) {
      setMaintInventory((prev) =>
        prev.some((item) => item.itemID === searchedTag.itemID)
          ? prev
          : [...prev, itemWithConfirmed],
      );

      setConfirmedMaintInventory((prev) =>
        prev.some((item) => item.itemID === searchedTag.itemID)
          ? prev
          : [...prev, itemWithConfirmed],
      );
    } else {
      setItInventory((prev) =>
        prev.some((item) => item.itemID === searchedTag.itemID)
          ? prev
          : [...prev, itemWithConfirmed],
      );

      setConfirmedITInventory((prev) =>
        prev.some((item) => item.itemID === searchedTag.itemID)
          ? prev
          : [...prev, itemWithConfirmed],
      );
    }
  }, [searchedTag, searchTag, isSearching]);

  const handleRowClick = (
    params: { row: Item },
    inventoryType: "it" | "maintenance",
  ) => {
    const item = params.row;

    const verifiedBy = toUpperStr(`${item?.verified_by ?? ""} `).trim();

    const verifiedItem: Item = {
      ...item,
      isThere: true,
      verified_by: verifiedBy,
      verif_time: item.verif_time,
    };

    // Show verification card on this specific grid
    setSelectedItem(verifiedItem);
    setSelectedInventory(inventoryType);

    if (inventoryType === "maintenance") {
      setMaintInventory((prev) =>
        prev.map((x) => (x.itemID === item.itemID ? verifiedItem : x)),
      );

      setConfirmedMaintInventory((prev) => {
        const exists = prev.some((x) => x.itemID === item.itemID);

        return exists
          ? prev.map((x) => (x.itemID === item.itemID ? verifiedItem : x))
          : [...prev, verifiedItem];
      });
    } else {
      setItInventory((prev) =>
        prev.map((x) => (x.itemID === item.itemID ? verifiedItem : x)),
      );

      setConfirmedITInventory((prev) => {
        const exists = prev.some((x) => x.itemID === item.itemID);

        return exists
          ? prev.map((x) => (x.itemID === item.itemID ? verifiedItem : x))
          : [...prev, verifiedItem];
      });
    }
  };

  const printInventoryWorksheet = () => {
    const html = createInventoryPrintHtml(itInventory, maintInventory);

    const iframe = document.createElement("iframe");

    // Keep the iframe completely hidden
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";

    document.body.appendChild(iframe);

    const iframeDocument =
      iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDocument) {
      document.body.removeChild(iframe);

      setToast({
        open: true,
        msg: "Unable to prepare print document.",
        sev: "error",
      });

      return;
    }

    iframeDocument.open();

    iframeDocument.write(html);

    iframeDocument.close();

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();

        iframe.contentWindow?.print();

        // Give the browser time to finish
        // before removing the iframe.
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1000);
      }, 100);
    };
  };

  return (
    <>
      {isAttested && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,

            // Background overlay
            background:
              "linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.94))",
            backdropFilter: "blur(8px)",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 3,
          }}
        >
          <Box
            sx={{
              width: "min(700px, 90vw)",
              textAlign: "center",

              background: "rgba(255, 255, 255, 0.98)",
              borderRadius: 4,
              padding: { xs: 4, md: 6 },

              boxShadow: "0 25px 70px rgba(0, 0, 0, 0.45)",

              border: "1px solid rgba(255, 255, 255, 0.2)",

              position: "relative",
              overflow: "hidden",

              // subtle top accent
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "6px",
                background: "linear-gradient(90deg, #ef4444, #f97316, #eab308)",
              },
            }}
          >
            {/* Warning icon */}
            <Box
              sx={{
                width: 90,
                height: 90,
                margin: "0 auto 25px",
                borderRadius: "50%",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background: "linear-gradient(135deg, #fee2e2, #fecaca)",
                color: "#dc2626",

                fontSize: "3rem",
                fontWeight: "bold",

                boxShadow: "0 10px 30px rgba(220, 38, 38, 0.2)",
              }}
            >
              !
            </Box>

            <Typography
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 800,
                color: "#1e293b",
                letterSpacing: "-0.03em",
                mb: 2,
              }}
            >
              Already Attested
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.25rem" },
                color: "#64748b",
                lineHeight: 1.6,
                maxWidth: 550,
                margin: "0 auto",
              }}
            >
              You have already attested the Inventory. <br /> No further action
              is required.
            </Typography>
          </Box>
        </Box>
      )}

      {!isAttested && (
        <Box
          sx={{
            display: "flex",
            minHeight: "85vh",
            flexDirection: "column",
          }}
        >
          <Stack
            spacing={2}
            sx={{
              mb: 3,
              px: { xs: 2.5, md: 3.5 },
              py: 2.5,
              borderRadius: 3,
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
              position: "relative",
              overflow: "hidden",

              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "5px",
                background: "linear-gradient(180deg, #2563eb, #06b6d4)",
              },
            }}
          >
            {/* Employee / Building / Cubicle */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "2fr 1.5fr 1fr",
                },
                gap: { xs: 2, sm: 3 },
                alignItems: "center",
              }}
            >
              {/* Name */}
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    color: "#94a3b8",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    mb: 0.5,
                  }}
                >
                  Employee
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: "1.35rem", md: "1.55rem" },
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {toUpperStr(
                    `${employeeInfo?.First_Name ?? ""} ${
                      employeeInfo?.Last_Name ?? ""
                    }`,
                  )}
                </Typography>
              </Box>

              {/* Building */}
              <Box
                sx={{
                  borderLeft: { sm: "1px solid #e2e8f0" },
                  pl: { sm: 3 },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    color: "#94a3b8",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    mb: 0.5,
                  }}
                >
                  Building
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#334155",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {employeeInfo?.bldgName || "N/A"}
                </Typography>
              </Box>

              {/* Cubicle */}
              <Box
                sx={{
                  borderLeft: { sm: "1px solid #e2e8f0" },
                  pl: { sm: 3 },
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    color: "#94a3b8",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    mb: 0.5,
                  }}
                >
                  Cubicle
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#334155",
                    lineHeight: 1.2,
                  }}
                >
                  {employeeInfo?.cubicle || "N/A"}
                </Typography>
              </Box>
            </Box>

            {/* HR Note */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                px: 2,
                py: 1.25,
                borderRadius: 2,
                backgroundColor: "#fffbeb",
                border: "1px solid #fde68a",
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  minWidth: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fef3c7",
                  color: "#d97706",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                }}
              >
                !
              </Box>

              <Typography
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#78350f",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontWeight: 800,
                    color: "#92400e",
                    mr: 0.5,
                  }}
                >
                  IMPORTANT:
                </Box>
                {toUpperStr(
                  "If your cubicle is different, please contact Human Resource (HR).",
                )}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            sx={{
              backgroundColor: "#f8fafc",
              minHeight: "90vh",
              borderRadius: 5,
              overflow: "hidden",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* Inventory Content */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                p: { xs: 2, md: 4 },
                overflow: "auto",
              }}
            >
              <Stack spacing={4}>
                {/* IT Inventory */}
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#0f172a",
                      mb: 1,
                    }}
                  >
                    IT Inventory
                  </Typography>

                  <hr />

                  <Box
                    sx={{
                      position: "relative",
                      height: 400,
                      width: "100%",
                    }}
                  >
                    <DataGrid
                      rows={itInventory}
                      columns={itInvCol}
                      getRowId={(row: Item) => row.itemID}
                      onRowClick={(params) => handleRowClick(params, "it")}
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 10,
                          },
                        },
                      }}
                      pageSizeOptions={[10, 20]}
                    />

                    {/* IT verification card */}
                    {selectedInventory === "it" && selectedItem && (
                      <VerificationCard
                        item={selectedItem}
                        onClose={() => {
                          setSelectedItem(null);
                          setSelectedInventory(null);
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Maintenance Inventory */}
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#0f172a",
                      mb: 1,
                    }}
                  >
                    Maintenance Inventory
                  </Typography>

                  <hr />

                  <Box
                    sx={{
                      position: "relative",
                      height: 400,
                      width: "100%",
                    }}
                  >
                    <DataGrid
                      rows={maintInventory}
                      columns={maintInvCol}
                      getRowId={(row: Item) => row.itemID}
                      onRowClick={(params) =>
                        handleRowClick(params, "maintenance")
                      }
                      initialState={{
                        pagination: {
                          paginationModel: {
                            pageSize: 10,
                          },
                        },
                      }}
                      pageSizeOptions={[10, 20]}
                    />

                    {/* Maintenance verification card */}
                    {selectedInventory === "maintenance" && selectedItem && (
                      <VerificationCard
                        item={selectedItem}
                        onClose={() => {
                          setSelectedItem(null);
                          setSelectedInventory(null);
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              mb: 3,
              mt: 2,
              px: { xs: 2, sm: 3 },
              py: 2,
              background: "linear-gradient(135deg, #9b9b9b 0%, #f8fafc 100%)",
              border: "1px solid #e2e8f0",
              borderRadius: 3,
              boxShadow: "0 4px 16px rgba(15, 23, 42, 0.06)",
              justifyContent: "right",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{
                flex: 1,
                maxWidth: { sm: 600 },
              }}
            >
              <TextField
                fullWidth
                size="small"
                label="Search Inventory"
                placeholder="Enter a tag number..."
                value={searchInput}
                onChange={(e) => {
                  e.target.value = toUpperStr(e.target.value);
                  searchInventoryRef.current = e.target.value;
                  setSearchInput(e.target.value);
                }}
                autoComplete="off"
                slotProps={{
                  htmlInput: {
                    autoComplete: "new-password",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#ffffff",
                    borderRadius: 2,

                    "&:hover fieldset": {
                      borderColor: "#94a3b8",
                    },

                    "&.Mui-focused fieldset": {
                      borderColor: "#2563eb",
                      borderWidth: 2,
                    },
                  },

                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#2563eb",
                  },
                }}
              />
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleSearch()}
                sx={{
                  minWidth: 130,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "0 4px 10px rgba(245, 158, 11, 0.25)",
                  "&:hover": {
                    boxShadow: "0 6px 14px rgba(245, 158, 11, 0.35)",
                  },
                }}
              >
                Search Tag
              </Button>
            </Stack>

            {/* Actions */}
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                onClick={printInventoryWorksheet}
                sx={{
                  px: 2.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
                    boxShadow: "0 6px 16px rgba(37, 99, 235, 0.35)",
                  },
                }}
              >
                Print Worksheet
              </Button>
              <Button
                variant="contained"
                sx={{
                  px: 2.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",

                  background: "linear-gradient(135deg, #207e34, #2b5234)",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1e6e16, #1d8f27)",
                    boxShadow: "0 6px 16px rgba(37, 99, 235, 0.35)",
                  },
                }}
                onClick={() => setOnCompleteOpen(true)}
              >
                Complete Attestation
              </Button>
            </Stack>
          </Stack>

          <Dialog
            open={onCompleteOpen}
            onClose={onCompleteClose}
            maxWidth="sm"
            fullWidth
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6">
                Enter "Attested" to attest all . This cannot be undone!
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 3, justifyContent: "center" }}
              >
                <TextField
                  label="Enter Attested"
                  onChange={(e) => (confirmRef.current = e.target.value)}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 3, justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    confirmRef.current = "";
                    setOnCompleteOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={finalConfirm}
                >
                  Attest
                </Button>
              </Stack>
            </Box>
          </Dialog>
          {toast && (
            <Toast
              open={toast.open}
              msg={toast.msg}
              sev={toast.sev}
              onClose={() => setToast(null)}
            />
          )}
        </Box>
      )}
    </>
  );
}
