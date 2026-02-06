// import { uploadMedicalReport } from "@/api/patient/medicalReports";
// import { useMutation } from "@tanstack/react-query";


// export function useUploadMedicalReport() {
//   return useMutation({
//     mutationFn: uploadMedicalReport,
//   });
// }


// import axios from "@/lib/axios";
// import { useMutation } from "@tanstack/react-query";

// export const uploadMedicalReport = async ({ patientId, formData }: { patientId: string; formData: FormData }) => {
//   // Try known candidate routes in order. Some servers register `patients` (plural).
//   const candidates = [
//     `/patient/${patientId}/medical-reports`,
//     // `/patients/${patientId}/medical-reports`,
//   ];

//   let lastError: any = null;
//   for (let i = 0; i < candidates.length; i++) {
//     const url = candidates[i];
//     try {
//       // console.log(`[uploadMedicalReport] POST ${url}`, { formDataKeys: Array.from((formData as any).keys?.() ?? []) });
//       const res = await axios.post(url, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       // console.log(`[uploadMedicalReport] Success ${url}`, res.data);
//       return res.data;
//     } catch (err: any) {
//       lastError = err;
//       const status = err?.response?.status;
//       // console.log(`[uploadMedicalReport] Error ${url} status=${status}`, {
//       //   message: err.message,
//       //   data: err?.response?.data,
//       //   requestData: err?.config?.data,
//       // });
//       // If 404 try next candidate; otherwise re-throw the error
//       if (status !== 404) throw err;
//       // otherwise continue to next candidate
//     }
//   }

//   // If we reach here, all candidates failed. Throw the last error.
//   throw lastError;
// };

// export function useUploadMedicalReport() {
//   return useMutation({
//     mutationFn: ({ patientId, formData }: { patientId: string; formData: FormData }) =>
//       uploadMedicalReport({ patientId, formData }),
//   });
// }


import axios from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export const uploadMedicalReport = async ({ patientId, formData }: { patientId: string; formData: FormData }) => {
  // Try known candidate routes in order. Some servers register `patients` (plural).
  const candidates = [
    `/patient/${patientId}/medical-reports`,
    `/patients/${patientId}/medical-reports`,
  ];

  let lastError: any = null;
  for (let i = 0; i < candidates.length; i++) {
    const url = candidates[i];
    try {
      console.log(`[uploadMedicalReport] POST ${url}`, { formDataKeys: Array.from((formData as any).keys?.() ?? []) });
      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(`[uploadMedicalReport] Success ${url}`, res.data);
      return res.data;
    } catch (err: any) {
      lastError = err;
      const status = err?.response?.status;
      console.log(`[uploadMedicalReport] Error ${url} status=${status}`, {
        message: err.message,
        data: err?.response?.data,
        requestData: err?.config?.data,
      });
      // If 404 try next candidate; otherwise re-throw the error
      if (status !== 404) throw err;
      // otherwise continue to next candidate
    }
  }

  // If we reach here, all candidates failed. Throw the last error.
  throw lastError;
};

export function useUploadMedicalReport() {
  return useMutation({
    mutationFn: ({ patientId, formData }: { patientId: string; formData: FormData }) =>
      uploadMedicalReport({ patientId, formData }),
  });
}
