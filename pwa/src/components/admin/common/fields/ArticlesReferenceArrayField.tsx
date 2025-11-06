import { ChipField, ReferenceArrayField, SingleFieldList } from "react-admin";

export const ArticlesReferenceArrayField = (props: any) => (
  <ReferenceArrayField
    label="Articles"
    reference="api/articles"
    source="articles"
  >
    <SingleFieldList linkType="show">
      <ChipField source="ref" />
    </SingleFieldList>
  </ReferenceArrayField>
);
