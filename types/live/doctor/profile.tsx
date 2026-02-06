export type DoctorProfileGroup =
    | "personal_information"
    | "working_experience"
    | "education_info"
    | "certifications_info"
    | "address_contact"
    | "awards_info"
    | "social_media"
    | "additional_information"
    | "professional_experience";

export interface PersonalInformation {
    first_name: string;
    last_name: string;
    bio: string;
    department_id: string;
    email: string;
    avatar: string;
}

export interface WorkingExperience {
    career_start: string;
    past_associations: string;
}

export interface WorkingExperienceGroup {
    professional_experience_info: WorkingExperience[];
}

export interface EducationInfo {
    degree: string;
    institution: string;
    start_date: string;
    end_date: string;
}

export interface EducationHistoryGroup {
    education_info: EducationInfo[];
}

export interface CertificationInfo {
    name: string;
    organization: string;
    certification_image: string;
}

export interface CertificationsGroup {
    certifications_info: CertificationInfo[];
}

export interface AddressContact {
    address_line1: string;
    address_line2: string;
    country: string;
    state: string;
    city: string;
    postal_code: string;
}

export interface AwardInfo {
    title: string;
    award_image: string;
}

export interface AwardsGroup {
    awards_info: AwardInfo[];
}

export interface SocialLinks {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
}

export interface SocialMediaGroup {
    social_links: SocialLinks;
}

export interface ProfessionalExperience {
    id?: string;
    total_experience: string;
    specialties: string[];
    memberships?: string[];
}

export interface DoctorProfileResponse<T> {
    status: boolean;
    message: string;
    group: DoctorProfileGroup;
    path: string;
    timestamp: string;
    data: T;
}
