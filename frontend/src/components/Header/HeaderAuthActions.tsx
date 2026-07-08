import { Link } from 'react-router-dom';
import Button from '../Button';

interface HeaderAuthActionsProps {
  layoutClassName?: string;
  buttonClassName?: string;
  onNavigate?: () => void;
}

const authActions = [
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Sign Up' },
] as const;

const HeaderAuthActions = ({
  layoutClassName = 'flex items-center gap-2',
  buttonClassName = 'px-3 py-1.5 text-sm lg:px-4 lg:py-2',
  onNavigate,
}: HeaderAuthActionsProps) => {
  return (
    <div className={layoutClassName}>
      {authActions.map((action) => (
        <Link key={action.to} to={action.to} onClick={onNavigate}>
          <Button className={buttonClassName}>{action.label}</Button>
        </Link>
      ))}
    </div>
  );
};

export default HeaderAuthActions;