import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";

const initialFormData = {
  bankName: "",
  branch: "",
  accountType: "",
  address: "",
  logo: ""
};

const ManageBank = () => {
  const [banks, setBanks] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editId, setEditId] = useState(null);
  const [isListView, setIsListView] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    const querySnapshot = await getDocs(collection(db, "banks"));
    const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setBanks(list);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      const bankDoc = doc(db, "banks", editId);
      await updateDoc(bankDoc, formData);
    } else {
      await addDoc(collection(db, "banks"), formData);
    }
    setFormData(initialFormData);
    setEditId(null);
    setIsListView(true);
    fetchBanks();
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
    setIsListView(false);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "banks", id));
    fetchBanks();
  };

  const handleAddNew = () => {
    setFormData(initialFormData);
    setEditId(null);
    setIsListView(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-[210mm] mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-12 mt-4 md:mt-6">
          <div className="ml-2 md:ml-4">
            <div onClick={handleGoBack} className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer">
              <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              <span className="text-sm md:text-base">Back to Home</span>
            </div>
          </div>
        </div>

        {isListView ? (
          <>
            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Bank List</h3>
              {banks.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 mb-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <div>
                    <p className="text-lg font-semibold capitalize">{item.bankName}</p>
                    <p className="text-gray-600">Branch: {item.branch}</p>
                    <p className="text-gray-600">Account Type: {item.accountType}</p>
                    {item.address && <p className="text-gray-600">Address: {item.address}</p>}
                    {item.logo && <img src={item.logo} alt="Bank Logo" className="h-10 mt-2" />}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddNew}
              className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{editId ? "Edit Bank" : "Add New Bank"}</h3>

            <label className="text-gray-700">Bank Name</label>
            <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" required />

            <label className="text-gray-700">Branch</label>
            <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" required />

            <label className="text-gray-700">Account Type</label>
            <input type="text" name="accountType" value={formData.accountType} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" required />

            <label className="text-gray-700">Address (optional)</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" />

            <label className="text-gray-700">Logo (optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="p-3 border border-gray-300 rounded-md" />
            {formData.logo && <img src={formData.logo} alt="Bank Logo Preview" className="h-10 mt-2" />}

            <button type="submit" className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors">
              {editId ? "Update Bank" : "Add Bank"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ManageBank;
