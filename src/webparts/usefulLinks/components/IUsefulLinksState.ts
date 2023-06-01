export interface IUsefulLinksState {
  links: LinkItem[];
  invalidListFormat: boolean;
}

export interface LinkItem {
  Id: number;
  Title: string;
  Link: { Description: string; Url: string };
  Description: string;
  Img: string;
  image?: {
    fieldId: string;
    fieldName: string;
    fileName: string;
    id: string;
    nativeFile: any; // The type of nativeFile may be any
    serverRelativeUrl: string;
    serverUrl: string;
    type: string;
  };
}
