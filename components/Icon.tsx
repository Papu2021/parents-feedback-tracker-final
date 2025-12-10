import React from 'react';
import { 
  Stethoscope, 
  Baby, 
  Users, 
  Activity, 
  Globe, 
  GraduationCap, 
  BrainCircuit, 
  HeartHandshake, 
  School, 
  Languages,
  CheckCircle,
  XCircle,
  LogOut,
  Plus,
  Trash2,
  ArrowRight,
  List,
  Star,
  Hash,
  User,
  UserPlus,
  Download,
  LayoutDashboard,
  Settings,
  FileText,
  Phone,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, className = "" }) => {
  const icons: Record<string, React.ElementType> = {
    Stethoscope, Baby, Users, Activity, Globe, GraduationCap, 
    BrainCircuit, HeartHandshake, School, Languages,
    CheckCircle, XCircle, LogOut, Plus, Trash2, ArrowRight, List, Star,
    Hash, User, UserPlus, Download, LayoutDashboard, Settings, FileText,
    Phone, ChevronLeft, ChevronRight, Search
  };

  const LucideIcon = icons[name];
  return LucideIcon ? <LucideIcon size={size} className={className} /> : null;
};

export default Icon;