import {
  OF_STATUT,
  OrdreFabrication,
} from "@/types/resources/OrdreFabrication";
import { Chip, ChipProps } from "@mui/material";
import React from "react";
import { useRecordContext } from "react-admin";

/**
 * A reusable MUI Chip component that displays the status of an {@link OrdreFabrication}.
 *
 * It automatically determines the appropriate label and color based on the `statut` property
 * of the provided `record` object, referencing the `OF_STATUT` constant.
 *
 * If `record` is not provided, it attempts to retrieve the record context
 * using `useRecordContext` (useful when used within react-admin components like `Datagrid`).
 *
 * @param {object} props - The component props.
 * @param {OrdreFabrication} [props.record] - The manufacturing order object whose status is to be displayed.
 * If not provided, it attempts to use the record context.
 * @param {ChipProps} [props.props] - Additional props to pass directly to the underlying MUI `Chip` component.
 * These will override default props like `size="small"`.
 * @returns {JSX.Element | null} A colored MUI `Chip` displaying the fabrication order status, or `null` if no fabrication order data is available.
 *
 * @example
 * // Example usage with a provided OrdreFabrication object:
 * <OrdreFabricationStatutChip record={{ statut: 'EN_COURS', ... }} />
 *
 * @example
 * // Example usage within a react-admin component (it uses useRecordContext):
 * <Datagrid>
 * <OrdreFabricationStatutChip />
 * </Datagrid>
 */
export const OrdreFabricationStatutChip = ({
  record,
  props,
}: {
  record?: OrdreFabrication | undefined;
  props?: ChipProps;
}) => {
  const contextRecord = useRecordContext<OrdreFabrication>();
  const o = record || contextRecord;
  if (!o) return null;

  const { label, muiColor } = OF_STATUT[o.statut];
  return <Chip label={label} color={muiColor} size="small" {...props} />;
};
