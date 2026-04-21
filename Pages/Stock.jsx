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
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
} from "@expo-google-fonts/urbanist";
import { Ionicons } from "@expo/vector-icons";

import AnimatedBox from "../components/AnimatedBox.jsx";

const MAIN = "#09111E";

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
import { useTheme } from '../src/context/ThemeContext';

export default function StockScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  // Sidebar states: "press" (minimal), "collapsed" (icons only), "expanded" (full)
  const [sidebarState, setSidebarState] = useState("press");

  const isPressState = sidebarState === "press";
  const isCollapsed = sidebarState === "collapsed";
  const isExpanded = sidebarState === "expanded";

  const { isDarkMode, toggleTheme } = useTheme();
  const darkMode = isDarkMode;
  const [selectedItem, setSelectedItem] = useState("Stock");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // New Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
  });

  const [searchText, setSearchText] = useState("");
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
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
      // Fetch everything in parallel
      const [catRes, allProdRes, stockRes] = await Promise.all([
        api.getAllCategories(),
        api.getAllProducts(),
        api.getAllStockBatches()
      ]);

      if (catRes && catRes.categories) {
        setCategoriesList(catRes.categories);
      }

      const allProducts = allProdRes.products || []; // Assuming backend returns { products: [] }
      const batches = stockRes.stockBatch || [];

      // Create a map for product details (stock agnostic)
      // and then fill in stock info
      const productMap = {};

      allProducts.forEach(p => {
        productMap[p.id] = {
          id: p.id,
          TextHead: p.product_name,
          subText: p.category_name || "General", // api.getAllProducts joins category? If not, we map manually later or rely on p
          categoryId: p.category_id,
          kilosRaw: 0,
          minExpiry: null,
          batches: [],
          lowStockThreshold: Number(p.low_stock_threshold || 0),
          // Use product image if available
          Image: (p.product_image) ? { uri: p.product_image } : require("../assets/images/default-product-image.png"),
          description: "No stock available.",
          PurchaseDate: "N/A",
          ExpiryDate: "N/A",
          ViewText: "No Stock",
          isLowStock: false
        };
      });

      // Overlay batch data
      batches.forEach(b => {
        const prod = productMap[b.product_id];
        if (prod) {
          prod.kilosRaw += Number(b.quantity_remaining);
          prod.batches.push(b);
          const exp = new Date(b.expiry_date);
          if (!prod.minExpiry || exp < prod.minExpiry) prod.minExpiry = exp;
          // Update image if batch has better image? Usually product image is source of truth
        }
      });

      // Finalize processing
      const processed = Object.values(productMap).map(g => {
        const isLow = g.kilosRaw <= g.lowStockThreshold;
        return {
          ...g,
          kilos: `${g.kilosRaw}`,
          ViewText: g.minExpiry ? `Expires ${g.minExpiry.toLocaleDateString()}` : (g.kilosRaw > 0 ? "No expiry" : "No Stock"),
          PurchaseDate: g.batches.length > 0 ? "Multiple batches" : "N/A",
          ExpiryDate: g.minExpiry ? g.minExpiry.toLocaleDateString() : "N/A",
          description: g.kilosRaw > 0 ? `Total stock: ${g.kilosRaw}. ${g.batches.length} batches.` : "No stock available.",
          isLowStock: isLow && g.kilosRaw <= g.lowStockThreshold // logic check
        };
      });
      // Sort: Low stock first, then alphabetical?
      // Or keep random. Let's sort alphabetically for now.
      processed.sort((a, b) => a.TextHead.localeCompare(b.TextHead));

      setProducts(processed);
    } catch (error) {
      console.log("Error fetching stock data", error);
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
  const handleArrowPress = () => {
    setSidebarState("expanded");
  };

  const handlePressTextClick = () => {
    setSidebarState("collapsed");
  };

  // const handleNavItemPress = (itemName) => {
  //   setSelectedItem(itemName);
  //   setSidebarState("press");
  //   if (navigation) {
  //     navigation.navigate(getRouteName(itemName));
  //   }
  // };


  const handleCloseSidebar = () => {
    setSidebarState("press");
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
      // Check if updating
      if (newProductData.id) {
        const res = await api.updateProduct(newProductData.id, {
          productName: newProductData.productName,
          categoryId: newProductData.categoryId,
          lowStockThresHold: newProductData.lowStockThreshold || 10,
          productImage: newProductData.productImage
        });
        if (res && (res.message || res.status === 200)) {
          Toast.show({ type: 'success', text1: 'Success', text2: 'Product updated successfully' });
          setAddNewProductVisible(false);
          fetchStockData();
          setNewProductData({ productName: "", categoryId: "", lowStockThreshold: "10", productImage: null });
          setSelectedProduct(null); // Close details modal if open
        } else {
          Toast.show({ type: 'error', text1: 'Error', text2: 'Error updating product' });
        }
      } else {
        // Creating
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
      }
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (prod) => {
    setNewProductData({
      id: prod.id,
      productName: prod.TextHead,
      categoryId: prod.categoryId,
      lowStockThreshold: String(prod.lowStockThreshold),
      productImage: prod.Image && prod.Image.uri ? prod.Image.uri : null
    });
    setAddNewProductVisible(true);
  };

  const handleDeleteProduct = async (prodId) => {
    try {
      // Confirm? (React Native Alert)
      // For simplicity directly calling api
      setLoading(true);
      const res = await api.deleteProduct(prodId);
      if (res) {
        Toast.show({ type: 'success', text1: 'Deleted', text2: 'Product deleted successfully' });
        setSelectedProduct(null);
        fetchStockData();
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
    <View style={[styles.container, { backgroundColor: darkMode ? "#09111E" : "#fff" }]}>
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

      {/* OVERLAY - Shows when sidebar is expanded */}
      {isExpanded && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleCloseSidebar}
        />
      )}

      {/* SIDEBAR */}
      <View
        style={[
          styles.sidebar,
          {
            width: isPressState ? 40 : isCollapsed ? 70 : 250,
            backgroundColor: MAIN,
            alignItems: isPressState ? "center" : isCollapsed ? "center" : "flex-start",
            paddingHorizontal: isPressState ? 0 : isCollapsed ? 6 : 10,
          },
        ]}
      >
        {/* Toggle Arrow - Only visible when collapsed */}
        {isCollapsed && (
          <TouchableOpacity
            onPress={handleArrowPress}
            style={styles.arrowButton}
          >
            <Ionicons
              name="chevron-forward"
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        )}

        {/* Close Arrow - Only visible when expanded */}
        {isExpanded && (
          <TouchableOpacity
            onPress={handleCloseSidebar}
            style={styles.closeButton}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        )}

        {/* Stocka Logo - Not shown in press state */}
        {!isPressState && (
          <View style={[styles.logoContainerSidebar, isExpanded && styles.logoContainerExpanded]}>
            <Image
              source={require("../assets/images/ppl.png")}
              style={{ width: 36, height: 36 }}
              tintColor="#fff" />
            {isExpanded && <Text style={styles.stockText}>Stocka</Text>}
          </View>
        )}

        {/* Menu Items - Not shown in press state */}
        {!isPressState && (
          <>
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={[
                  styles.navItem,
                  isExpanded && styles.navItemExpanded,
                  selectedItem === "Dashboard" && isExpanded && styles.navItemSelected
                ]}
                onPress={() => handleNavItemPress("Dashboard")}
              >
                <Ionicons name="battery-charging-outline" size={22} color="#fff" />
                {isExpanded && <Text style={styles.navText}>Dashboard</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navItem,
                  isExpanded && styles.navItemExpanded,
                  selectedItem === "Stock" && isExpanded && styles.navItemSelected
                ]}
                onPress={() => handleNavItemPress("Stock")}
              >
                <Ionicons name="cube-outline" size={22} color="#fff" />
                {isExpanded && <Text style={styles.navText}>Stock</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navItem,
                  isExpanded && styles.navItemExpanded,
                  selectedItem === "Sales" && isExpanded && styles.navItemSelected
                ]}
                onPress={() => handleNavItemPress("Sales")}
              >
                <Ionicons name="flash-outline" size={22} color="#fff" />
                {isExpanded && <Text style={styles.navText}>Sales</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navItem,
                  isExpanded && styles.navItemExpanded,
                  selectedItem === "Reports" && isExpanded && styles.navItemSelected
                ]}
                onPress={() => handleNavItemPress("Reports")}
              >
                <Ionicons name="document-text-outline" size={22} color="#fff" />
                {isExpanded && <Text style={styles.navText}>Reports</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navItem,
                  isExpanded && styles.navItemExpanded,
                  selectedItem === "Debtors" && isExpanded && styles.navItemSelected
                ]}
                onPress={() => handleNavItemPress("Debtors")}
              >
                <Ionicons name="wallet-outline" size={22} color="#fff" />
                {isExpanded && <Text style={styles.navText}>Debtors</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navItem,
                  isExpanded && styles.navItemExpanded,
                  selectedItem === "Profile" && isExpanded && styles.navItemSelected
                ]}
                onPress={() => handleNavItemPress("Profile")}
              >
                <Ionicons name="person-outline" size={22} color="#fff" />
                {isExpanded && <Text style={styles.navText}>Profile</Text>}
              </TouchableOpacity>
            </View>

            {/* Divider */}
            {isExpanded && <View style={styles.divider} />}

            {/* Utility Items */}
            <View style={styles.utilityContainer}>
              <TouchableOpacity
                style={[styles.navItem, isExpanded && styles.navItemExpanded]}
                onPress={() => setHelpModalVisible(true)}
              >
                <Ionicons name="help-circle-outline" size={22} color="#fff" />
                {isExpanded && <Text style={styles.navText}>Help</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navItem, isExpanded && styles.navItemExpanded]}
                onPress={() => setShowLogoutModal(true)}
              >
                <Ionicons name="log-out-outline" size={22} color="#fff" />
                {isExpanded && <Text style={styles.navText}>Logout</Text>}
              </TouchableOpacity>
            </View>

            {/* Theme Toggle - At the bottom, only when expanded */}
            {isExpanded && (
              <View style={styles.themeToggleContainer}>
                <View style={styles.themeToggle}>
                  <Ionicons
                    name="sunny"
                    size={20}
                    color={!darkMode ? MAIN : "#999"}
                  />
                  <TouchableOpacity
                    style={[
                      styles.themeToggleSwitch,
                      darkMode && styles.themeToggleSwitchActive
                    ]}
                    onPress={toggleTheme}
                  >
                    <View style={[
                      styles.themeToggleKnob,
                      darkMode && styles.themeToggleKnobActive
                    ]} />
                  </TouchableOpacity>
                  <Ionicons
                    name="moon"
                    size={20}
                    color={darkMode ? "#fff" : "#999"}
                  />
                </View>
              </View>
            )}
          </>
        )}
      </View>


      {/* CONTENT */}
      <View style={{ flex: 1, marginLeft: isPressState ? 40 : isCollapsed ? 70 : 0, backgroundColor: darkMode ? "#09111E" : "#fff", paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={darkMode && styles.darkScrollView}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#09111E"]} />
            }
          >
            <View style={{ padding: 15 }}>
              {/* Header */}
              <AnimatedBox type="fade" duration={600}>
                <View style={[styles.headerRow, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 20 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {navigation?.canGoBack() && (
                      <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                      >
                        <Ionicons name="arrow-back" size={24} color={darkMode ? "#fff" : "#000"} />
                      </TouchableOpacity>
                    )}
                    <View style={styles.logoContainerHeader}>
                      <Image source={require("../assets/images/ppl.png")} style={{ width: 36, height: 36 }} />
                      <Text style={[styles.stockaText, darkMode && styles.darkText]}>Stocka</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setHelpModalVisible(true)}>
                    <Ionicons name="help-circle-outline" size={26} color={darkMode ? "#fff" : MAIN} />
                  </TouchableOpacity>
                </View>
              </AnimatedBox>

              <AnimatedBox type="slideUp" delay={100}>
                <View style={styles.searchCategoryContainer}>
                  <TextInput style={styles.searchInput} placeholder="Search..." value={searchText} onChangeText={setSearchText} placeholderTextColor={darkMode ? "#aaa" : "#999"} />
                  <TouchableOpacity style={styles.categoryDropdown} onPress={() => setCategoryVisible(true)}>
                    <Text style={styles.categoryText}>{selectedCategory}</Text>
                    <Ionicons name="chevron-down" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </AnimatedBox>

              <AnimatedBox type="slideUp" delay={200}>
                <Text style={[styles.title, darkMode && styles.darkText]}>Products in Stock</Text>
              </AnimatedBox>

              {filteredProducts.filter(p => p.TextHead.toLowerCase().includes(searchText.toLowerCase())).length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20, fontFamily: "Urbanist_400Regular", color: darkMode ? '#aaa' : '#666' }}>No products found</Text>
              ) : filteredProducts.filter(p => p.TextHead.toLowerCase().includes(searchText.toLowerCase())).map((item, index) => (
                <AnimatedBox key={item.id} delay={index * 100} type="slideUp">
                  <View style={[styles.productCard, darkMode && styles.darkProductCard]}>
                    <Image source={item.Image} style={styles.productImage} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={[styles.productName, darkMode && styles.darkText]}>{item.TextHead}</Text>
                      <Text style={[styles.productCategory, darkMode && { color: "#aaa" }]}>{item.subText}</Text>
                      <Text style={[styles.productKilos, darkMode && { color: "#aaa" }]}>{item.kilos}</Text>

                      <View style={styles.warningWrapper}>
                        {item.minExpiry && (
                          <View style={{ flexDirection: 'row', marginRight: 10, alignItems: 'center' }}>
                            <Ionicons name="time-outline" size={16} color="#aaa" />
                            <Text style={[styles.productExpiry, darkMode && { color: "#ff6b6b" }]}>{item.ViewText}</Text>
                          </View>
                        )}

                      </View>

                      <AnimatedBox isButton={true} onPress={() => setSelectedProduct(item)} style={styles.viewButton}>
                        <Text style={styles.viewButtonText}>View Details</Text>
                      </AnimatedBox>
                    </View>
                  </View>
                </AnimatedBox>
              ))}

              <AnimatedBox isButton={true} usePulse={true} onPress={() => setAddNewProductVisible(true)} style={styles.productButton}>
                <Text style={styles.addText}>+ Add Product</Text>
              </AnimatedBox>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* ================= CATEGORY MODAL ================= */}
      <Modal visible={categoryVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setCategoryVisible(false)} />
        <View style={[styles.modalContainer, darkMode && { backgroundColor: '#121d2b' }]}>
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

                {/* Low Stock Warning */}
                {selectedProduct?.isLowStock && (
                  <View style={styles.warningWrapper}>
                    <Ionicons name="warning" size={16} color="#FF4444" />
                    <Text style={[styles.productExpiry, { color: "#FF4444", marginLeft: 5 }]}>Low Stock</Text>
                  </View>
                )}

                <Detail label="Selling Price" value={selectedProduct?.price} darkMode={darkMode} />
                <Detail label="Cost Price" value={selectedProduct?.costPrice} darkMode={darkMode} />
                <Detail label="Expiry" value={selectedProduct?.expiry} darkMode={darkMode} />
                <Detail label="Low Stock Threshold" value={selectedProduct?.lowStockThreshold} darkMode={darkMode} />
              </View>

              {/* Right */}
              <View style={styles.detailsRight}>
                <Image
                  source={selectedProduct?.Image}
                  style={styles.detailsImage}
                />
                <Text style={[styles.descriptionText, darkMode && { color: "#fff" }]}>
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

            {/* Management Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 15 }}>
              <TouchableOpacity onPress={() => handleEditProduct(selectedProduct)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="create-outline" size={20} color={MAIN} />
                <Text style={{ marginLeft: 5, color: MAIN, fontFamily: "Urbanist_500Medium" }}>Edit Product</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDeleteProduct(selectedProduct.id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="trash-outline" size={20} color="red" />
                <Text style={{ marginLeft: 5, color: "red", fontFamily: "Urbanist_500Medium" }}>Delete Product</Text>
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
              <Text style={[styles.detailsTitle, darkMode && styles.darkText]}>
                {newProductData.id ? "Edit Product" : "Create New Product"}
              </Text>
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
                    <Text style={{ fontSize: 12, color: MAIN, fontFamily: "Urbanist_400Regular" }}>Add Picture</Text>
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
              <View style={{ backgroundColor: darkMode ? "#09111E" : "#F2F2F2", borderRadius: 8, marginBottom: 12, borderWidth: darkMode ? 1 : 0, borderColor: "#444" }}>
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
                          backgroundColor: newProductData.categoryId === cat.id ? MAIN : (darkMode ? "#121d2b" : "#fff"),
                          marginRight: 8,
                          borderWidth: 1,
                          borderColor: newProductData.categoryId === cat.id ? MAIN : "#ddd"
                        }}
                      >
                        <Text style={{ color: newProductData.categoryId === cat.id ? "#fff" : (darkMode ? "#fff" : "#333"), fontSize: 12, fontFamily: "Urbanist_400Regular" }}>
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
                <Text style={styles.actionText}>{newProductData.id ? "Update Product" : "Create Product"}</Text>
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
              color="#09111E"
              style={{ marginBottom: 10 }}
            />

            <Text style={styles.logoutModalText}>
              Are you sure about logging out?
            </Text>

            <View style={styles.logoutModalButtons}>
              <TouchableOpacity
                style={styles.logoutYesButton}
                onPress={async () => {
                  setShowLogoutModal(false);
                  await logout();
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
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
  <AnimatedBox
    isButton={true}
    onPress={onPress}
    style={[
      styles.navItem,
      expanded && styles.navItemExpanded,
      active && expanded && styles.navItemSelected,
    ]}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons name={icon} size={22} color="#fff" />
      {expanded && <Text style={styles.navText}>{label}</Text>}
    </View>
  </AnimatedBox>
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
        darkMode && { backgroundColor: "#09111E", color: "#fff", borderColor: "#444" },
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
    backgroundColor: "#09111E",
  },
  darkText: {
    color: "#fff",
  },
  darkProductCard: {
    backgroundColor: "#121d2b",
  },
  darkModalContainer: {
    backgroundColor: "#121d2b",
  },
  darkModalItem: {
    backgroundColor: "#121d2b",
  },
  darkDetailsCard: {
    backgroundColor: "#121d2b",
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
    backgroundColor: "rgba(9, 17, 30, 0.3)",
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
    fontFamily: "Urbanist_600SemiBold",
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
    fontFamily: "Urbanist_700Bold",
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
    fontFamily: "Urbanist_500Medium",
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
    bottom: 0,
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  themeToggleSwitch: {
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
  },
  themeToggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#09111E",
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
  logoContainerHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  stockaText: { fontFamily: "Urbanist_700Bold", fontSize: 22, color: MAIN, marginLeft: 10 },

  searchCategoryContainer: { flexDirection: "row", marginBottom: 20 },
  searchInput: { flex: 1, backgroundColor: "#F0F0F0", borderRadius: 8, padding: 10, marginRight: 10, fontFamily: "Urbanist_400Regular", color: "#000" },

  categoryDropdown: { flexDirection: "row", backgroundColor: MAIN, padding: 10, borderRadius: 8 },
  categoryText: { color: "#fff", marginRight: 5, fontFamily: "Urbanist_400Regular" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)" },
  modalContainer: { position: "absolute", top: 100, right: 20, backgroundColor: "#fff", borderRadius: 10, width: 160 },

  modalItem: { padding: 12 },
  modalText: { fontFamily: "Urbanist_500Medium" },

  title: { fontFamily: "Urbanist_700Bold", fontSize: 18, marginBottom: 12 },

  productCard: { flexDirection: "row", backgroundColor: "#F5F5F5", padding: 12, borderRadius: 12, marginBottom: 12 },
  productImage: { width: 80, height: 80, borderRadius: 8 },

  productName: { fontFamily: "Urbanist_600SemiBold", fontSize: 16 },
  productCategory: { fontSize: 12, color: "#555", fontFamily: "Urbanist_400Regular" },
  productKilos: { fontSize: 12, color: "#555", fontFamily: "Urbanist_400Regular" },

  warningWrapper: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  productExpiry: { fontSize: 12, color: "red", marginLeft: 6, fontFamily: "Urbanist_400Regular" },

  viewButton: { backgroundColor: MAIN, padding: 8, borderRadius: 8, marginTop: 4, alignSelf: "flex-start" },
  viewButtonText: { color: "#fff", fontSize: 12, fontFamily: "Urbanist_400Regular" },

  /* ===== MODAL ===== */
  overlay: { flex: 1, backgroundColor: "rgba(9,17,30,0.25)", justifyContent: "center", alignItems: "center" },
  detailsCard: { width: "90%", backgroundColor: "#fff", borderRadius: 16, padding: 20 },

  detailsHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  detailsTitle: { fontFamily: "Urbanist_700Bold", fontSize: 18 },

  detailsContent: { flexDirection: "row" },
  detailsLeft: { flex: 1 },
  detailsRight: { flex: 1, alignItems: "center" },

  detailsImage: { width: 120, height: 120, borderRadius: 10, marginBottom: 10, borderColor: "#e1dedeff", borderWidth: 2 },

  descriptionText: { fontSize: 12, color: "#555", textAlign: "left", fontFamily: "Urbanist_400Regular" },

  detailLabel: { fontSize: 12, color: "#777", fontFamily: "Urbanist_400Regular" },
  detailValue: { fontFamily: "Urbanist_500Medium", color: "#000" },

  detailsActions: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },

  actionButton: { backgroundColor: MAIN, padding: 10, borderRadius: 8, flex: 1, marginRight: 8 },
  actionText: { color: "#fff", textAlign: "center", fontFamily: "Urbanist_400Regular" },

  actionButtonOutline: { borderWidth: 1, borderColor: MAIN, padding: 10, borderRadius: 8, flex: 1 },
  actionTextOutline: { color: MAIN, textAlign: "center", fontFamily: "Urbanist_400Regular" },

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
    fontFamily: "Urbanist_400Regular",
  },

  /* ===== ADD STOCK MODAL ===== */
  addOverlay: {
    flex: 1,
    backgroundColor: "rgba(9,17,30,0.35)",
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
    fontFamily: "Urbanist_700Bold",
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
    fontFamily: "Urbanist_400Regular",
  },

  formInput: {
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    padding: 10,
    fontFamily: "Urbanist_400Regular",
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
    fontFamily: "Urbanist_500Medium",
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
    fontFamily: "Urbanist_500Medium",
  },

  addProductButton: {
    width: "100%",
    marginTop: 15,
  },

  productButton: {
    backgroundColor: "#09111E",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",

    ...Platform.select({
      ios: {
        shadowColor: "#0A5E8C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0px 4px 6px rgba(10,94,140,0.4)",
      },
    }),
  },

  addText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Urbanist_600SemiBold",
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
    fontFamily: "Urbanist_500Medium",
    fontSize: 13,
    marginVertical: 10,
    textAlign: "center",
  },
  logoutModalButtons: {
    flexDirection: "row",
    marginTop: 14,
  },
  logoutYesButton: {
    backgroundColor: "#09111E",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginRight: 10,
  },
  logoutYesText: {
    color: "#fff",
    fontFamily: "Urbanist_500Medium",
    fontSize: 12,
  },
  logoutNoButton: {
    borderWidth: 1,
    borderColor: "#09111E",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutNoText: {
    fontFamily: "Urbanist_500Medium",
    fontSize: 12,
    color: "#09111E",
  },

});

const formStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(9,17,30,0.5)",
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: "0px 10px 20px rgba(0,0,0,0.3)",
      },
    }),
  },
  darkCard: {
    backgroundColor: "#121d2b",
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
    fontFamily: "Urbanist_700Bold",
    fontSize: 20,
    color: "#09111E",
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
    alignSelf: 'center', // Fix alignment
  },

  staticLabel: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
    fontFamily: "Urbanist_400Regular",
  },

  staticValue: {
    fontFamily: "Urbanist_600SemiBold",
    marginBottom: 6,
  },

  formGroup: {
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    color: "#333",
    marginBottom: 4,
    fontFamily: "Urbanist_400Regular",
  },

  input: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    fontFamily: "Urbanist_400Regular",
    color: "#333",
    backgroundColor: "#FAFAFA",
  },

  textarea: {
    height: 90,
    textAlignVertical: "top",
  },

  addButton: {
    backgroundColor: "#09111E",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#09111E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 4px 8px rgba(9,17,30,0.3)",
      },
    }),
  },

  addText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Urbanist_600SemiBold",
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
    backgroundColor: "rgba(9,17,30,0.5)",
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: "0px 10px 20px rgba(0,0,0,0.3)",
      },
    }),
  },
  darkCard: {
    backgroundColor: "#121d2b",
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
    fontFamily: "Urbanist_700Bold",
    fontSize: 20,
    color: "#09111E",
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
    fontFamily: "Urbanist_400Regular",
  },

  value: {
    fontSize: 13,
    fontFamily: "Urbanist_500Medium",
    marginBottom: 8,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginBottom: 8,
    borderColor: "#dededeff",
    borderWidth: 2,
    alignSelf: 'center', // Fix
  },

  descTitle: {
    fontSize: 12,
    fontFamily: "Urbanist_600SemiBold",
    marginBottom: 4,
  },

  description: {
    fontSize: 11,
    color: "#555",
    fontFamily: "Urbanist_400Regular",
  },

  sectionTitle: {
    fontFamily: "Urbanist_600SemiBold",
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
    backgroundColor: "#09111E",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#09111E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: "0px 4px 8px rgba(9,17,30,0.3)",
      },
    }),
  },

  recordText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 16,
    letterSpacing: 1,
  },

});






