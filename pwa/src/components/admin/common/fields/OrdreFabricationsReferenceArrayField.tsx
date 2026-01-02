import { ReferenceArrayField, SingleFieldList, ChipField } from "react-admin";

export const OrdreFabricationsReferenceArrayField = (props: any) => (
  <ReferenceArrayField
    source="ordreFabrications"
    reference="api/ordre_fabrications"
    {...props}
  >
    <SingleFieldList linkType="show">
      <ChipField source="ref" />
    </SingleFieldList>
  </ReferenceArrayField>
);
