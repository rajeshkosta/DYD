import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Input, message,  Select, Switch } from 'antd';
import { Edit2, Trash2, Plus, Eye, Search, Filter } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../store/slices/productSlice';
import { productService } from '../../services/api';

const ProductList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector((state: RootState) => state.product);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: '', category: '' });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  console.log("products", products);
  

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value.toLowerCase() });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(filters.search) || 
                          String(product.price).includes(filters.search);
    const matchesCategory = filters.category ? product.category === filters.category : true;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    { title: 'Product Name', dataIndex: 'name', key: 'name' },
    // { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price: number) => `${price}` },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: boolean, record: any) => (
          <Switch
            checked={status}
            onChange={async (checked) => {
              try {
                // First, deactivate all other banners
                const updatePromises = products.map((product : any) =>
                    product.id !== record.id && product.status
                    ? productService.updateStatus(product.id, false)
                    : Promise.resolve()
                );
  
                // Wait for all other banners to be deactivated
                await Promise.all(updatePromises);
  
                // Activate the selected banner
                await productService.updateStatus(record.id, checked);
  
                message.success('Status updated successfully');
                dispatch(fetchProducts() as any);
              } catch (error) {
                message.error('Failed to update status');
              }
            }}
          />
        ),
      },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="text" icon={<Edit2 size={16} onClick={() => handleEdit(record)} />} />
          <Button type="text" danger icon={<Trash2 size={16} onClick={() => handleDelete(record.id)} />} />
          <Button type="text" icon={<Eye size={16} />} style={{ color: 'green' }} onClick={() => handleView(record)} />
        </Space>
      ),
    },
  ];

  const handleAddProduct = () => navigate('/dashboard/productForm');
  const handleEdit = (record: any) => navigate('/dashboard/productForm', { state: { product: record } });
  const handleView = (record: any) => navigate('/dashboard/productDetails', { state: { product: record } });

  const handleDeleteConfirm = async () => {
    if (selectedProductId) {
      const hideLoading = message.loading('Deleting...', 0);
      try {
      const response =  await productService.deleteProduct(selectedProductId);
        if(response && response.message){
            message.success(response.message);
        }else{
            message.success('Product deleted successfully');
        }
        dispatch(fetchProducts());
        setIsModalVisible(false);
      } catch (error : any) {
        if(error.response && error.response.data && error.response.data.message){
            message.error(error.response.data.message);
        }else{
            message.error('Failed to delete product. Please try again.');
        }
      } finally {
        hideLoading();
        setIsModalVisible(false);
        setSelectedProductId(null);
      }
    }
  };

  const handleDelete = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalVisible(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Product Management</h1>
        <div className="flex gap-4 items-center">
          <Input placeholder="Search products..." prefix={<Search size={16} />} className="w-64" onChange={(e) => handleSearch(e.target.value)} />
          <Select placeholder="Filter by Category" onChange={(value) => handleFilterChange('category', value)} allowClear className="w-[180px]">
            <Select.Option value="electronics">Electronics</Select.Option>
            <Select.Option value="clothing">Clothing</Select.Option>
            <Select.Option value="food">Food</Select.Option>
          </Select>
          <Button type="primary" icon={<Plus size={16} />} onClick={handleAddProduct}>Add Product</Button>
        </div>
      </div>
      <Table columns={columns} dataSource={filteredProducts} loading={loading} rowKey="id" pagination={{ pageSize: 10 }} />
      
      <Modal title="Confirm Deletion" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={handleDeleteConfirm} okText="Delete" cancelText="Cancel" okButtonProps={{ danger: true }}>
        <p>Are you sure you want to delete this product?</p>
      </Modal>
    </div>
  );
};

export default ProductList;
