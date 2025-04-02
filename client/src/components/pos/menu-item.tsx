interface MenuItemProps {
  id: number;
  name: string;
  price: number;
  category: string;
  onAddToOrder: (id: number, name: string, price: number) => void;
}

const MenuItem = ({ id, name, price, category, onAddToOrder }: MenuItemProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cocktails':
        return 'ri-cocktail-line';
      case 'beer':
        return 'ri-goblet-line';
      case 'wine':
        return 'ri-goblet-line';
      case 'spirits':
        return 'ri-glass-line';
      default:
        return 'ri-goblet-line';
    }
  };
  
  const getIconColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cocktails':
        return 'primary';
      case 'beer':
        return 'accent';
      case 'wine':
        return 'primary';
      case 'spirits':
        return 'secondary';
      default:
        return 'primary';
    }
  };
  
  return (
    <button 
      onClick={() => onAddToOrder(id, name, price)}
      className="flex flex-col items-center justify-center bg-light-100 hover:bg-light-200 rounded-lg p-4 transition-colors h-32"
    >
      <div className={`w-12 h-12 bg-${getIconColor(category)} bg-opacity-10 rounded-full flex items-center justify-center mb-2`}>
        <i className={`${getCategoryIcon(category)} text-${getIconColor(category)} text-xl`}></i>
      </div>
      <p className="text-sm font-medium text-center">{name}</p>
      <p className="text-sm font-mono">${price.toFixed(2)}</p>
    </button>
  );
};

export default MenuItem;
