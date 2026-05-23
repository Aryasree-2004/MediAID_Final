export interface CitizenRequest { name: string; dob: string; gender: string; address: string; contactInfo: string; }
export interface CitizenResponse { citizenId: number; name: string; dob: string; gender: string; address: string; contactInfo: string; status: 'PENDING' | 'VERIFIED' | 'SUSPENDED'; }
export interface CitizenDocumentResponse { documentId: number; citizenId: number; fileName: string; fileType: string; uploadDate: string; status: string; }
