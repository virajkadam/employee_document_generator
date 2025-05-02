import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";

const initialFormData = {
  name: "",
  customerId: "",
  customerType: "",
  address: "",
  statementDate: "",
  statementPeriod: { from: "", to: "" },
  accountNumber: "",
  accountType: "",
  branch: "",
  ifsc: "",
  nominee: ""
};

const ManageBank = () => {
  const [bankStatements, setBankStatements] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editId, setEditId] = useState(null);
  const [isListView, setIsListView] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBankStatements();
  }, []);

  const fetchBankStatements = async () => {
    const querySnapshot = await getDocs(collection(db, "bankStatements"));
    const list = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setBankStatements(list);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "from" || name === "to") {
      setFormData({
        ...formData,
        statementPeriod: { ...formData.statementPeriod, [name]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      const bankDoc = doc(db, "bankStatements", editId);
      await updateDoc(bankDoc, formData);
    } else {
      await addDoc(collection(db, "bankStatements"), formData);
    }
    setFormData(initialFormData);
    setEditId(null);
    setIsListView(true);
    fetchBankStatements();
  };

  const handleEdit = (item) => {
    setFormData({ ...item, statementPeriod: item.statementPeriod || { from: "", to: "" } });
    setEditId(item.id);
    setIsListView(false);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "bankStatements", id));
    fetchBankStatements();
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
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Bank Statement List</h3>
              {bankStatements.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 mb-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <div>
                    <p className="text-lg font-semibold capitalize">{item.name}</p>
                    <p className="text-gray-600">Customer ID: {item.customerId}</p>
                    <p className="text-gray-600">Account No: {item.accountNumber}</p>
                    <p className="text-gray-600">Statement Date: {item.statementDate}</p>
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
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{editId ? "Edit Bank Statement" : "Add New Bank Statement"}</h3>

            <label className="text-gray-700">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" required />

            <label className="text-gray-700">Customer ID</label>
            <input type="text" name="customerId" value={formData.customerId} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" required />

            <label className="text-gray-700">Customer Type</label>
            <input type="text" name="customerType" value={formData.customerType} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" required />

            <label className="text-gray-700">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" required />

            <label className="text-gray-700">Statement Date</label>
            <input type="date" name="statementDate" value={formData.statementDate} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" required />

            <label className="text-gray-700">Statement Period From</label>
            <input type="date" name="from" value={formData.statementPeriod.from} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" required />

            <label className="text-gray-700">Statement Period To</label>
            <input type="date" name="to" value={formData.statementPeriod.to} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" required />

            <label className="text-gray-700">Account Number</label>
            <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" required />

            <label className="text-gray-700">Account Type</label>
            <input type="text" name="accountType" value={formData.accountType} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" required />

            <label className="text-gray-700">Branch</label>
            <input type="text" name="branch" value={formData.branch} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" required />

            <label className="text-gray-700">IFSC</label>
            <input type="text" name="ifsc" value={formData.ifsc} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" required />

            <label className="text-gray-700">Nominee</label>
            <input type="text" name="nominee" value={formData.nominee} onChange={handleChange} className="p-3 border border-gray-300 rounded-md" required />

            <button type="submit" className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors">
              {editId ? "Update Bank Statement" : "Add Bank Statement"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ManageBank;
