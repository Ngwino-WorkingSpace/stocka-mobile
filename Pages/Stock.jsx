import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";

const MAIN = "#09364D";

// Helper function to map display names to route names
const getRouteName = (itemName) => {
  const routeMap = {
    "Dashboard": "dashboard",
    "Stock": "Stock",
    "Sales": "Sales",
    "Reports": "Reports",
    "Profile": "Profile",
    "Debtors": "debtors",
  };
  return routeMap[itemName] || itemName;
};

import { api } from "../src/services/api";
import { useAuth } from "../src/context/AuthContext";
import { useFocusEffect } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

export default function StockScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  // Sidebar states: "press" (minimal), "collapsed" (icons only), "expanded" (full)
  const [sidebarState, setSidebarState] = useState("press");

  const isPressState = sidebarState === "press";
  const isCollapsed = sidebarState === "collapsed";
  const isExpanded = sidebarState === "expanded";

  const [darkMode, setDarkMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Stock");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // New Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [searchText, setSearchText] = useState("");
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addStockVisible, setAddStockVisible] = useState(false);

  // Add Product (New) Modal
  const [addNewProductVisible, setAddNewProductVisible] = useState(false);
  const [newProductData, setNewProductData] = useState({
    productName: "",
    categoryId: "",
    lowStockThreshold: "10"
  });

  const [categoriesList, setCategoriesList] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await api.getAllCategories();
      if (res && res.categories) {
        setCategoriesList(res.categories);
      }
    } catch (e) {
      console.log("Error fetching categories", e);
    }
  };

  const fetchStockData = async () => {
    try {
      setLoading(true);
      await fetchCategories();
      const res = await api.getAllStockBatches();
      // Group by product
      const groups = {};
      const batches = res.stockBatch || [];

      batches.forEach(b => {
        if (!groups[b.product_id]) {
          groups[b.product_id] = {
            id: b.product_id,
            TextHead: b.product_name,
            subText: b.category_name || "General",
            kilosRaw: 0,
            minExpiry: null,
            batches: [],
            // Placeholder images based on index or random?
            // Existing logic had specific images. We'll use a default.
            Image: (b.product_image || b.image) ? { uri: b.product_image || b.image } : require("../assets/images/default-product-image.png"),
          };
        }
        const g = groups[b.product_id];
        g.kilosRaw += Number(b.quantity_remaining);
        g.batches.push(b);
        const exp = new Date(b.expiry_date);
        if (!g.minExpiry || exp < g.minExpiry) g.minExpiry = exp;
      });

      const processed = Object.values(groups).map(g => ({
        ...g,
        kilos: `${g.kilosRaw} kg`, // Assuming unit is consistent or generic
        ViewText: g.minExpiry ? `Expires ${g.minExpiry.toLocaleDateString()}` : "No expiry",
        PurchaseDate: "Multiple batches",
        ExpiryDate: g.minExpiry ? g.minExpiry.toLocaleDateString() : "N/A",
        description: `Total stock: ${g.kilosRaw}. ${g.batches.length} batches in stock.`
      }));

      setProducts(processed);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchStockData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchStockData();
    }, [])
  );

  // Reuse existing state setup mostly
  const [formData, setFormData] = useState({
    quantity: "",
    price: "",
    purchaseDate: "",
    expiryDate: "",
    description: "",
  });
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const [recordSaleVisible, setRecordSaleVisible] = useState(false);

  const [saleData, setSaleData] = useState({
    quantity: "",
    unitPrice: "",
    totalPrice: "",
  });

  const handleSaleChange = (field, value) => {
    setSaleData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddStock = async () => {
    if (!selectedProduct) return;
    if (!formData.quantity || !formData.price) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Quantity and Price are required' });
      return;
    }
    try {
      setLoading(true);
      const qty = parseFloat(formData.quantity.replace(/[^0-9.]/g, ''));
      const price = parseFloat(formData.price.replace(/[^0-9.]/g, ''));

      const res = await api.addStockBatch(selectedProduct.id, {
        quantity: qty,
        purchasePrice: price,
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : new Date(),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined
      });

      if (res && (res.message || res.status === 201)) {
        Toast.show({ type: 'success', text1: 'Success', text2: 'Stock added successfully' });
        setAddStockVisible(false);
        fetchStockData();
        setFormData({ quantity: "", price: "", purchaseDate: "", expiryDate: "", description: "" });
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Error adding stock' });
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordSale = async () => {
    if (!selectedProduct) return;
    if (!saleData.quantity || !saleData.unitPrice) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Quantity and Unit Price are required' });
      return;
    }
    try {
      setLoading(true);
      const qty = parseFloat(saleData.quantity.replace(/[^0-9.]/g, ''));
      const price = parseFloat(saleData.unitPrice.replace(/[^0-9.]/g, ''));

      const res = await api.createSale({
        productId: selectedProduct.id,
        quantitySold: qty,
        unitSellingPrice: price,
      });

      if (res && (res.message || res.status === 201)) {
        Toast.show({ type: 'success', text1: 'Success', text2: 'Sale recorded successfully' });
        setRecordSaleVisible(false);
        fetchStockData();
        setSaleData({ quantity: "", unitPrice: "", totalPrice: "" });
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Error recording sale' });
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProductData.productName) {
      Toast.show({ type: 'error', text1: 'Missing Field', text2: 'Product Name is required' });
      return;
    }
    if (!newProductData.categoryId) {
      Toast.show({ type: 'error', text1: 'Missing Field', text2: 'Please select a category' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.addProduct({
        productName: newProductData.productName,
        categoryId: newProductData.categoryId,
        lowStockThresHold: newProductData.lowStockThreshold || 10,
        productImage: newProductData.productImage
      });

      if (res && (res.message || res.status === 201)) {
        Toast.show({ type: 'success', text1: 'Success', text2: 'Product created successfully' });
        setAddNewProductVisible(false);
        fetchStockData();
        setNewProductData({ productName: "", categoryId: "", lowStockThreshold: "10", productImage: null });
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Error creating product' });
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'We need access to your gallery to upload images.' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setNewProductData({ ...newProductData, productImage: result.assets[0].uri });
    }
  };

  const StockProducts = products;
  const categories = ["All", ...categoriesList.map(c => c.category_name)];

  if (!fontsLoaded) return null;

  const handleNavItemPress = (itemName) => {
    setSelectedItem(itemName);
    setSidebarState("press");
    if (navigation) navigation.navigate(getRouteName(itemName));
  };

  const filteredProducts = selectedCategory === "All"
    ? StockProducts
    : StockProducts.filter((p) => p.subText === selectedCategory);



  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#1a1a2e" : "#fff", paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* FLOATING PRESS HANDLE */}
      {isPressState && (
        <TouchableOpacity
          onPress={() => setSidebarState("collapsed")}
          activeOpacity={0.8}
          style={styles.floatingPress}
        >
          <View style={styles.pressTextWrapper}>
            <Text style={styles.pressText}>S</Text>
            <Text style={styles.pressText}>S</Text>
            <Text style={styles.pressText}>E</Text>
            <Text style={styles.pressText}>R</Text>
            <Text style={styles.pressText}>P</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* OVERLAY */}
      {isExpanded && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setSidebarState("press")}
        />
      )}

      {/* SIDEBAR */}
      <View
        style={[
          styles.sidebar,
          {
            width: isPressState ? 40 : isCollapsed ? 70 : 220,
            backgroundColor: MAIN,
            alignItems: isPressState ? "center" : isCollapsed ? "center" : "flex-start",
            paddingHorizontal: isPressState ? 0 : isCollapsed ? 6 : 10,
          },
        ]}
      >
        {isCollapsed && (
          <TouchableOpacity onPress={() => setSidebarState("expanded")} style={styles.arrowButton}>
            <Ionicons name="chevron-forward" size={22} color="#fff" />
          </TouchableOpacity>
        )}
        {isExpanded && (
          <TouchableOpacity onPress={() => setSidebarState("press")} style={styles.closeButton}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
        )}

        {!isPressState && (
          <>
            <View style={[styles.logoContainerSidebar, isExpanded && styles.logoContainerExpanded]}>
              <Image source={require("../assets/images/stock.png")} style={{ width: 36, height: 36 }} />
              {isExpanded && <Text style={styles.stockText}>Stocka</Text>}
            </View>

            <View style={styles.menuContainer}>
              <NavItem icon="battery-charging-outline" label="Dashboard" active={selectedItem === "Dashboard"} expanded={isExpanded} onPress={() => handleNavItemPress("Dashboard")} />
              <NavItem icon="cube-outline" label="Stock" active={selectedItem === "Stock"} expanded={isExpanded} onPress={() => handleNavItemPress("Stock")} />
              <NavItem icon="flash-outline" label="Sales" active={selectedItem === "Sales"} expanded={isExpanded} onPress={() => handleNavItemPress("Sales")} />
              <NavItem icon="document-text-outline" label="Reports" active={selectedItem === "Reports"} expanded={isExpanded} onPress={() => handleNavItemPress("Reports")} />
              <NavItem icon="wallet-outline" label="Debtors" active={selectedItem === "Debtors"} expanded={isExpanded} onPress={() => handleNavItemPress("Debtors")} />
              <NavItem icon="person-outline" label="Profile" active={selectedItem === "Profile"} expanded={isExpanded} onPress={() => handleNavItemPress("Profile")} />
            </View>

            <View style={styles.divider} />

            <View style={styles.utilityContainer}>
              <NavItem icon="help-circle-outline" label="Help" expanded={isExpanded} onPress={() => setHelpModalVisible(true)} />
              <NavItem icon="log-out-outline" label="Logout" expanded={isExpanded} onPress={() => setShowLogoutModal(true)} />
            </View>
          </>
        )}
      </View>

      <SafeAreaView style={{ flex: 1, marginLeft: isPressState ? 40 : isCollapsed ? 70 : 0 }}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[MAIN]} />
          }
        >
          <View style={styles.headerRow}>
            <View style={styles.logoContainerHeader}>
              <Image source={require("../assets/images/stock.png")} style={{ width: 36, height: 36 }} />
              <Text style={[styles.stockaText, darkMode && styles.darkText]}>Stocka</Text>
            </View>
            <TouchableOpacity onPress={() => setHelpModalVisible(true)}>
              <Ionicons name="help-circle-outline" size={26} color={darkMode ? "#fff" : MAIN} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchCategoryContainer}>
            <TextInput style={styles.searchInput} placeholder="Search..." value={searchText} onChangeText={setSearchText} placeholderTextColor={darkMode ? "#aaa" : "#999"} />
            <TouchableOpacity style={styles.categoryDropdown} onPress={() => setCategoryVisible(true)}>
              <Text style={styles.categoryText}>{selectedCategory}</Text>
              <Ionicons name="chevron-down" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.title, darkMode && styles.darkText]}>Products in Stock</Text>

          {filteredProducts.filter(p => p.TextHead.toLowerCase().includes(searchText.toLowerCase())).length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20, color: darkMode ? '#aaa' : '#666' }}>No products found</Text>
          ) : filteredProducts.filter(p => p.TextHead.toLowerCase().includes(searchText.toLowerCase())).map((item) => (
            <View key={item.id} style={[styles.productCard, darkMode && styles.darkProductCard]}>
              <Image source={item.Image} style={styles.productImage} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.productName, darkMode && styles.darkText]}>{item.TextHead}</Text>
                <Text style={[styles.productCategory, darkMode && { color: "#aaa" }]}>{item.subText}</Text>
                <Text style={[styles.productKilos, darkMode && { color: "#aaa" }]}>{item.kilos}</Text>

                <View style={styles.warningWrapper}>
                  <Ionicons name="warning" size={18} color={MAIN} />
                  <Text style={[styles.productExpiry, darkMode && { color: "#ff6b6b" }]}>{item.ViewText}</Text>
                </View>

                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => setSelectedProduct(item)}
                >
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.productButton} onPress={() => setAddNewProductVisible(true)}>
            <Text style={styles.addText}>+ Add Product</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* ================= CATEGORY MODAL ================= */}
      <Modal visible={categoryVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setCategoryVisible(false)} />
        <View style={[styles.modalContainer, darkMode && { backgroundColor: '#2a2a3e' }]}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedCategory(item);
                  setCategoryVisible(false);
                }}
              >
                <Text style={[styles.modalText, darkMode && styles.darkText]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* ================= HELP MODAL ================= */}
      <Modal visible={helpModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.helpModalCard, darkMode && { backgroundColor: '#2a2a3e' }]}>
            <Ionicons name="help-circle-outline" size={48} color={darkMode ? "#4a9eff" : "#0A2A3F"} style={{ marginBottom: 15 }} />
            <Text style={[styles.helpModalTitle, darkMode && styles.darkText]}>Need Help?</Text>
            <Text style={[styles.helpModalText, darkMode && { color: '#aaa' }]}>
              Any problem? Text us via SMS or WhatsApp on +250792050511
            </Text>
            <TouchableOpacity style={styles.helpModalButton} onPress={() => setHelpModalVisible(false)}>
              <Text style={styles.helpModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= PRODUCT DETAILS MODAL ================= */}
      <Modal visible={!!selectedProduct} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={[styles.detailsCard, darkMode && styles.darkDetailsCard]}>
            {/* Header */}
            <View style={styles.detailsHeader}>
              <Text style={[styles.detailsTitle, darkMode && styles.darkText]}>Product Details</Text>
              <TouchableOpacity onPress={() => setSelectedProduct(null)}>
                <Ionicons name="close" size={22} color={darkMode ? "#fff" : "#333"} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.detailsContent}>
              {/* Left */}
              <View style={styles.detailsLeft}>
                <Detail label="Product" value={selectedProduct?.TextHead} darkMode={darkMode} />
                <Detail label="Category" value={selectedProduct?.subText} darkMode={darkMode} />
                <Detail label="Remaining Stock" value={selectedProduct?.kilos} darkMode={darkMode} />
                <Detail label="Purchase Date" value={selectedProduct?.PurchaseDate} darkMode={darkMode} />
                <Detail label="Expiry Date" value={selectedProduct?.ExpiryDate} darkMode={darkMode} />
              </View>

              {/* Right */}
              <View style={styles.detailsRight}>
                <Image
                  source={selectedProduct?.Image}
                  style={styles.detailsImage}
                />
                <Text style={[styles.descriptionText, darkMode && { color: "#aaa" }]}>
                  {selectedProduct?.description || "No description available."}
                </Text>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.detailsActions}>
              <TouchableOpacity style={styles.actionButton}
                onPress={() => setRecordSaleVisible(true)}
              >
                <Text style={styles.actionText}>Record Sale</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButtonOutline}
                onPress={() => setAddStockVisible(true)}
              >
                <Text style={styles.actionTextOutline}>Add Stock</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ================= CREATE NEW PRODUCT MODAL ================= */}
      <Modal 
        visible={addNewProductVisible} 
        transparent 
        animationType="slide"
        onShow={() => {
          // Ensure categories are loaded when modal opens
          if (categoriesList.length === 0) {
            fetchCategories();
          }
        }}
      >
        <View style={styles.overlay}>
          <View style={[styles.detailsCard, darkMode && styles.darkDetailsCard]}>
            <View style={styles.detailsHeader}>
              <Text style={[styles.detailsTitle, darkMode && styles.darkText]}>Create New Product</Text>
              <TouchableOpacity onPress={() => setAddNewProductVisible(false)}>
                <Ionicons name="close" size={22} color={darkMode ? "#fff" : "#333"} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity onPress={pickImage} style={[styles.imagePickerButton, { alignSelf: 'center', marginBottom: 20 }]}>
                {newProductData.productImage ? (
                  <Image source={{ uri: newProductData.productImage }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                ) : (
                  <View style={{ width: 100, height: 100, borderRadius: 10, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="camera-outline" size={40} color={MAIN} />
                    <Text style={{ fontSize: 10, color: MAIN }}>Add Picture</Text>
                  </View>
                )}
              </TouchableOpacity>

              <FormInput
                label="Product Name"
                placeholder="Ex: Irish Potatoes"
                value={newProductData.productName}
                onChangeText={(v) => setNewProductData({ ...newProductData, productName: v })}
                darkMode={darkMode}
              />

              <Text style={[styles.detailLabel, { marginBottom: 5 }, darkMode && { color: "#aaa" }]}>Category</Text>
              <View style={{ backgroundColor: darkMode ? "#1a1a2e" : "#F2F2F2", borderRadius: 8, marginBottom: 12, borderWidth: darkMode ? 1 : 0, borderColor: "#444" }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 10 }}>
                  {categoriesList.length === 0 ? (
                    <Text style={{ color: darkMode ? "#aaa" : "#666", fontSize: 12, padding: 10 }}>
                      No categories available. Please add a category first.
                    </Text>
                  ) : (
                    categoriesList.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setNewProductData({ ...newProductData, categoryId: cat.id })}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 20,
                        backgroundColor: newProductData.categoryId === cat.id ? MAIN : (darkMode ? "#2a2a3e" : "#fff"),
                        marginRight: 8,
                        borderWidth: 1,
                        borderColor: newProductData.categoryId === cat.id ? MAIN : "#ddd"
                      }}
                    >
                      <Text style={{ color: newProductData.categoryId === cat.id ? "#fff" : (darkMode ? "#fff" : "#333"), fontSize: 12 }}>
                        {cat.category_name}
                      </Text>
                    </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>

              <FormInput
                label="Low Stock Threshold"
                placeholder="Ex: 10"
                keyboardType="numeric"
                value={newProductData.lowStockThreshold}
                onChangeText={(v) => setNewProductData({ ...newProductData, lowStockThreshold: v })}
                darkMode={darkMode}
              />

              <TouchableOpacity style={[styles.actionButton, { marginTop: 10 }]} onPress={handleCreateProduct}>
                <Text style={styles.actionText}>Create Product</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ================= ADD STOCK MODAL ================= */}
      <Modal visible={addStockVisible} transparent animationType="slide">
        <View style={formStyles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setAddStockVisible(false)}
          />
          <KeyboardAvoidingView
            style={formStyles.modalContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              contentContainerStyle={formStyles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={[formStyles.card, darkMode && formStyles.darkCard]}>

                {/* Header */}
                <View style={[formStyles.header, darkMode && { borderBottomColor: "#444" }]}>
                  <Text style={[formStyles.title, darkMode && styles.darkText]}>Add to Stock</Text>
                  <TouchableOpacity onPress={() => setAddStockVisible(false)}>
                    <Ionicons name="close" size={22} color={darkMode ? "#fff" : "#333"} />
                  </TouchableOpacity>
                </View>

                {/* Body */}
                <View style={formStyles.body}>

                  {/* LEFT SIDE */}
                  <View style={formStyles.left}>

                    <Text style={[formStyles.staticLabel, darkMode && { color: "#aaa" }]}>Product Name</Text>
                    <Text style={[formStyles.staticValue, darkMode && styles.darkText]}>
                      {selectedProduct?.TextHead}
                    </Text>

                    <Text style={[formStyles.staticLabel, darkMode && { color: "#aaa" }]}>Category</Text>
                    <Text style={[formStyles.staticValue, darkMode && styles.darkText]}>
                      {selectedProduct?.subText}
                    </Text>

                    <FormInput
                      label="Quantity purchased"
                      placeholder="Ex: 54kg"
                      value={formData.quantity}
                      onChangeText={(v) => handleChange("quantity", v)}
                      inputStyle={formStyles.input}
                      darkMode={darkMode}
                    />

                    <FormInput
                      label="Purchase price per unit"
                      placeholder="Ex: 200 RWF"
                      value={formData.price}
                      onChangeText={(v) => handleChange("price", v)}
                      inputStyle={formStyles.input}
                      darkMode={darkMode}
                    />

                    <FormInput
                      label="Purchase Date"
                      placeholder="Ex: 2025-11-12"
                      value={formData.purchaseDate}
                      onChangeText={(v) => handleChange("purchaseDate", v)}
                      inputStyle={formStyles.input}
                      darkMode={darkMode}
                    />

                    <FormInput
                      label="Expiry Date"
                      placeholder="Ex: 2026-01-02"
                      value={formData.expiryDate}
                      onChangeText={(v) => handleChange("expiryDate", v)}
                      inputStyle={formStyles.input}
                      darkMode={darkMode}
                    />

                  </View>

                  {/* RIGHT SIDE */}
                  <View style={formStyles.right}>
                    <Image
                      source={selectedProduct?.Image}
                      style={formStyles.image}
                    />

                    <FormInput
                      label="Description (Optional)"
                      placeholder="Key notes..."
                      multiline
                      value={formData.description}
                      onChangeText={(v) => handleChange("description", v)}
                      inputStyle={formStyles.descriptionInput}
                      darkMode={darkMode}
                    />

                  </View>

                </View>

                {/* Button */}
                <TouchableOpacity style={formStyles.addButton} onPress={handleAddStock}>
                  <Text style={formStyles.addText}>ADD STOCK</Text>
                </TouchableOpacity>

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ================= SALES RECORD MODAL ================= */}
      <Modal visible={recordSaleVisible} transparent animationType="slide">
        <View style={saleStyles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setRecordSaleVisible(false)}
          />
          <KeyboardAvoidingView
            style={saleStyles.modalContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView
              contentContainerStyle={saleStyles.scrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={[saleStyles.card, darkMode && saleStyles.darkCard]}>

                {/* Header */}
                <View style={[saleStyles.header, darkMode && { borderBottomColor: "#444" }]}>
                  <Text style={[saleStyles.title, darkMode && styles.darkText]}>Record Sale</Text>
                  <TouchableOpacity onPress={() => setRecordSaleVisible(false)}>
                    <Ionicons name="close" size={22} color={darkMode ? "#fff" : "#333"} />
                  </TouchableOpacity>
                </View>

                {/* Body */}
                <View style={saleStyles.body}>

                  {/* LEFT */}
                  <View style={saleStyles.left}>
                    <Text style={[saleStyles.label, darkMode && { color: "#aaa" }]}>Product Name</Text>
                    <Text style={[saleStyles.value, darkMode && styles.darkText]}>{selectedProduct?.TextHead}</Text>

                    <Text style={[saleStyles.label, darkMode && { color: "#aaa" }]}>Category</Text>
                    <Text style={[saleStyles.value, darkMode && styles.darkText]}>{selectedProduct?.subText}</Text>

                    <Text style={[saleStyles.label, darkMode && { color: "#aaa" }]}>Remaining stock</Text>
                    <Text style={[saleStyles.value, darkMode && styles.darkText]}>{selectedProduct?.kilos}</Text>
                  </View>

                  {/* RIGHT */}
                  <View style={saleStyles.right}>
                    <Image
                      source={selectedProduct?.Image}
                      style={saleStyles.image}
                    />
                  </View>

                </View>

                {/* SALE FORM */}
                <Text style={[saleStyles.sectionTitle, darkMode && styles.darkText]}>Sale Details</Text>

                <View style={saleStyles.formRow}>
                  <View style={saleStyles.formInputWrapper}>
                    <FormInput
                      label="Quantity sold"
                      placeholder="Ex: 5"
                      value={saleData.quantity}
                      onChangeText={(v) => handleSaleChange("quantity", v)}
                      containerStyle={saleStyles.halfWidthContainer}
                      darkMode={darkMode}
                    />
                  </View>

                  <View style={saleStyles.formInputWrapper}>
                    <FormInput
                      label="Unit Selling Price"
                      placeholder="Ex: 500"
                      value={saleData.unitPrice}
                      onChangeText={(v) => handleSaleChange("unitPrice", v)}
                      containerStyle={saleStyles.halfWidthContainer}
                      darkMode={darkMode}
                    />
                  </View>
                </View>

                {/* BUTTON */}
                <TouchableOpacity style={saleStyles.recordButton} onPress={handleRecordSale}>
                  <Text style={saleStyles.recordText}>RECORD SALE</Text>
                </TouchableOpacity>

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* LOGOUT MODAL */}
      <Modal
        transparent
        animationType="fade"
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.logoutOverlay}>
          <View style={styles.logoutModalCard}>
            <Ionicons
              name="warning-outline"
              size={38}
              color="#0A2A3F"
              style={{ marginBottom: 10 }}
            />

            <Text style={styles.logoutModalText}>
              Are you sure about logging out?
            </Text>

            <View style={styles.logoutModalButtons}>
              <TouchableOpacity
                style={styles.logoutYesButton}
                onPress={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
              >
                <Text style={styles.logoutYesText}>YES</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutNoButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.logoutNoText}>NO</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

/* Sidebar NavItem Helper */
const NavItem = ({ icon, label, active, expanded, onPress }) => (
  <TouchableOpacity
    style={[
      styles.navItem,
      expanded && styles.navItemExpanded,
      active && expanded && styles.navItemSelected
    ]}
    onPress={onPress}
  >
    <Ionicons name={icon} size={22} color="#fff" />
    {expanded && <Text style={styles.navText}>{label}</Text>}
  </TouchableOpacity>
);

/* Small reusable component */
const Detail = ({ label, value, darkMode }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={[styles.detailLabel, darkMode && { color: "#aaa" }]}>{label}</Text>
    <Text style={[styles.detailValue, darkMode && styles.darkText]}>{value}</Text>
  </View>
);

const FormInput = ({
  label,
  multiline,
  inputStyle,
  containerStyle,
  darkMode,
  ...props
}) => (
  <View style={[styles.formGroup, containerStyle]}>
    <Text style={[styles.formLabel, darkMode && styles.darkText]}>{label}</Text>
    <TextInput
      style={[
        styles.formInput,
        multiline && styles.formTextarea,
        inputStyle,
        darkMode && { backgroundColor: "#1a1a2e", color: "#fff", borderColor: "#444" },
      ]}
      placeholderTextColor={darkMode ? "#aaa" : "#999"}
      multiline={multiline}
      {...props}
    />
  </View>
);



/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    position: "relative",
  },
  darkScrollView: {
    backgroundColor: "#1a1a2e",
  },
  darkText: {
    color: "#fff",
  },
  darkProductCard: {
    backgroundColor: "#2a2a3e",
  },
  darkModalContainer: {
    backgroundColor: "#2a2a3e",
  },
  darkModalItem: {
    backgroundColor: "#2a2a3e",
  },
  darkDetailsCard: {
    backgroundColor: "#2a2a3e",
  },
  floatingPress: {
    position: "absolute",
    left: 0,
    top: "45%",
    width: 34,
    height: 60,
    backgroundColor: MAIN,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    elevation: 6,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(9, 54, 77, 0.3)",
    zIndex: 5,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    paddingTop: 50,
    paddingHorizontal: 0,
    zIndex: 10,
    justifyContent: "center",
    overflow: "hidden",
  },
  pressContainer: {
    width: "100%",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  pressTextWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  pressText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Poppins_600SemiBold",
    lineHeight: 12,
    transform: [{ rotate: "-90deg" }],
  },
  arrowButton: {
    marginBottom: 25,
    padding: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 25,
    padding: 2,
    marginRight: 10,
  },
  logoContainerSidebar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    width: "100%",
  },
  logoContainerExpanded: {
    paddingLeft: 10,
    justifyContent: "flex-start",
  },
  stockText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
  },
  menuContainer: {
    width: "100%",
    marginTop: 5,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    minHeight: 44,
    overflow: "visible",
  },
  navItemExpanded: {
    justifyContent: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  navItemSelected: {
    backgroundColor: "#4a9eff",
  },
  navText: {
    color: "#fff",
    fontFamily: "Poppins_500Medium",
    marginLeft: 15,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 15,
    width: "100%",
  },
  utilityContainer: {
    width: "100%",
    marginTop: 10,
  },
  themeToggleContainer: {
    position: "absolute",
    bottom: 0,
    left: 10,
    right: 10,
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  themeToggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 2,
    marginHorizontal: 10,
    flexDirection: "row",
  },
  themeToggleSwitchActive: {
    backgroundColor: "#4a9eff",
    justifyContent: "flex-end",
  },
  themeToggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#09364D",
    alignSelf: "center",
  },
  themeToggleKnobActive: {
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  stockaText: { fontFamily: "Poppins_700Bold", fontSize: 22, color: MAIN, marginLeft: 10 },

  searchCategoryContainer: { flexDirection: "row", marginBottom: 20 },
  searchInput: { flex: 1, backgroundColor: "#F0F0F0", borderRadius: 8, padding: 10, marginRight: 10, fontFamily: "Poppins_400Regular", color: "#000" },

  categoryDropdown: { flexDirection: "row", backgroundColor: MAIN, padding: 10, borderRadius: 8 },
  categoryText: { color: "#fff", marginRight: 5, fontFamily: "Poppins_400Regular" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)" },
  modalContainer: { position: "absolute", top: 100, right: 20, backgroundColor: "#fff", borderRadius: 10, width: 160 },

  modalItem: { padding: 12 },
  modalText: { fontFamily: "Poppins_500Medium" },

  title: { fontFamily: "Poppins_700Bold", fontSize: 18, marginBottom: 12 },

  productCard: { flexDirection: "row", backgroundColor: "#F5F5F5", padding: 12, borderRadius: 12, marginBottom: 12 },
  productImage: { width: 80, height: 80, borderRadius: 8 },

  productName: { fontFamily: "Poppins_600SemiBold", fontSize: 16 },
  productCategory: { fontSize: 12, color: "#555", fontFamily: "Poppins_400Regular" },
  productKilos: { fontSize: 12, color: "#555", fontFamily: "Poppins_400Regular" },

  warningWrapper: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  productExpiry: { fontSize: 12, color: "red", marginLeft: 6, fontFamily: "Poppins_400Regular" },

  viewButton: { backgroundColor: MAIN, padding: 8, borderRadius: 8, marginTop: 4, alignSelf: "flex-start" },
  viewButtonText: { color: "#fff", fontSize: 12, fontFamily: "Poppins_400Regular" },

  /* ===== MODAL ===== */
  overlay: { flex: 1, backgroundColor: "rgba(9,54,77,0.25)", justifyContent: "center", alignItems: "center" },
  detailsCard: { width: "90%", backgroundColor: "#fff", borderRadius: 16, padding: 20 },

  detailsHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  detailsTitle: { fontFamily: "Poppins_700Bold", fontSize: 18 },

  detailsContent: { flexDirection: "row" },
  detailsLeft: { flex: 1 },
  detailsRight: { flex: 1, alignItems: "center" },

  detailsImage: { width: 120, height: 120, borderRadius: 10, marginBottom: 10, borderColor: "#e1dedeff", borderWidth: 2 },

  descriptionText: { fontSize: 12, color: "#555", textAlign: "left", fontFamily: "Poppins_400Regular" },

  detailLabel: { fontSize: 12, color: "#777", fontFamily: "Poppins_400Regular" },
  detailValue: { fontFamily: "Poppins_500Medium" },

  detailsActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },

  actionButton: { backgroundColor: MAIN, padding: 10, borderRadius: 8, flex: 1, marginRight: 8 },
  actionText: { color: "#fff", textAlign: "center", fontFamily: "Poppins_400Regular" },

  actionButtonOutline: { borderWidth: 1, borderColor: MAIN, padding: 10, borderRadius: 8, flex: 1 },
  actionTextOutline: { color: MAIN, textAlign: "center", fontFamily: "Poppins_400Regular" },

  addStockCard: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },

  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontFamily: "Poppins_400Regular",
  },

  /* ===== ADD STOCK MODAL ===== */
  addOverlay: {
    flex: 1,
    backgroundColor: "rgba(9,54,77,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  addCard: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
  },

  addHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  addTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: MAIN,
  },

  addForm: {
    marginBottom: 15,
  },

  formGroup: {
    marginBottom: 12,
  },

  formLabel: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
    fontFamily: "Poppins_400Regular",
  },

  formInput: {
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    padding: 10,
    fontFamily: "Poppins_400Regular",
    color: "#000",
  },

  formTextarea: {
    height: 80,
    textAlignVertical: "top",
  },

  addActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  addPrimaryBtn: {
    backgroundColor: MAIN,
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },

  addPrimaryText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },

  addSecondaryBtn: {
    borderWidth: 1,
    borderColor: MAIN,
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },

  addSecondaryText: {
    color: MAIN,
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
  },

  addProductButton: {
    width: "100%",
    marginTop: 15,
  },

  productButton: {
    backgroundColor: "#09364D",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",

    // Shadow (iOS)
    shadowColor: "#0A5E8C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,

    // Shadow (Android)
    elevation: 6,
  },

  addText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  logoutOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutModalCard: {
    width: "80%",
    maxWidth: 350,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
  },
  logoutModalText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    marginVertical: 10,
    textAlign: "center",
  },
  logoutModalButtons: {
    flexDirection: "row",
    marginTop: 14,
  },
  logoutYesButton: {
    backgroundColor: "#0A2A3F",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginRight: 10,
  },
  logoutYesText: {
    color: "#fff",
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
  },
  logoutNoButton: {
    borderWidth: 1,
    borderColor: "#0A2A3F",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutNoText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: "#0A2A3F",
  },

});

const formStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(9,54,77,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "93%",
    maxHeight: "90%",
  },
  scrollContent: {
    paddingVertical: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  darkCard: {
    backgroundColor: "#2a2a3e",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },

  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#09364D",
  },

  body: {
    flexDirection: "row",
  },

  left: {
    flex: 1,
    paddingRight: 10,
  },

  right: {
    flex: 1,
    alignItems: "center",
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 12,
    marginBottom: 10,
    borderColor: "#c5c5c5ff",
    borderWidth: 2,
  },

  staticLabel: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
    fontFamily: "Poppins_400Regular",
  },

  staticValue: {
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 6,
  },

  formGroup: {
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    color: "#333",
    marginBottom: 4,
    fontFamily: "Poppins_400Regular",
  },

  input: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#333",
    backgroundColor: "#FAFAFA",
  },

  textarea: {
    height: 90,
    textAlignVertical: "top",
  },

  addButton: {
    backgroundColor: "#09364D",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: "#09364D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  addText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    letterSpacing: 1,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 12,
    color: "#000",
  },

});


const saleStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(9,54,77,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "93%",
    maxHeight: "90%",
  },
  scrollContent: {
    paddingVertical: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  darkCard: {
    backgroundColor: "#2a2a3e",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },

  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#09364D",
  },

  body: {
    flexDirection: "row",
    marginBottom: 15,
  },

  left: {
    flex: 1,
  },

  right: {
    flex: 1,
    alignItems: "center",
  },

  label: {
    fontSize: 11,
    color: "#777",
    fontFamily: "Poppins_400Regular",
  },

  value: {
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    marginBottom: 8,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginBottom: 8,
    borderColor: "#dededeff",
    borderWidth: 2,
  },

  descTitle: {
    fontSize: 12,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 4,
  },

  description: {
    fontSize: 11,
    color: "#555",
    fontFamily: "Poppins_400Regular",
  },

  sectionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    marginVertical: 10,
  },

  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  formInputWrapper: {
    flex: 1,
  },

  halfWidthContainer: {
    flex: 1,
    marginBottom: 12,
  },

  recordButton: {
    backgroundColor: "#09364D",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    shadowColor: "#09364D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  recordText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    letterSpacing: 1,
  },

  /* Help Modal Styles */
  helpModalCard: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  helpModalTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    color: "#0A2A3F",
    marginBottom: 10,
  },
  helpModalText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  helpModalButton: {
    backgroundColor: "#0A2A3F",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
  },
  helpModalButtonText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    textAlign: "center",
  },

});


