 // --- Basic Setup & Globals ---
        const dbName = 'MaToePOSDB_V3'; // Increased version for schema changes (dashboard stats, low stock)
        const dbVersion = 1; // Increment if structure changes in onupgradeneeded
        let db; // Will hold the database connection
        let currentLanguage = 'en'; // Default language
        const requiredPassword = 'a&s2025'; // Access password for restricted sections (Master Password)
        let passwordVerified = false; // Flag if password has been entered correctly in the current session
        let sectionToAccess = null; // Stores the ID of the section needing password
        let deleteTarget = null; // Stores info for deletion confirmation { type, id }
        let currentTransaction = null; // Holds the state of the current POS transaction
        const currencySymbol = ' ကျပ်'; // Currency Symbol

        // --- Translations ---
        // Note: Myanmar translations updated to reflect currency change implicitly where applicable
        const translations = {
            en: {
                // ... (English translations remain mostly the same)
                pos_system_title: "Budget POS System", // Updated title
                menu_dashboard: "Dashboard",
                menu_pos: "Point of Sale",
                menu_items: "Items",
                menu_categories: "Categories",
                menu_stock: "Stock",
                menu_purchases: "Purchases",
                menu_daily_report: "Daily Report",
                menu_monthly_report: "Monthly Report",
                menu_settings: "Settings",
                menu_about: "About",
                dashboard_title: "Dashboard",
                dashboard_total_transactions_today: "Today's Transactions", // Updated key
                dashboard_sales_revenue_today: "Today's Sales Revenue", // Updated key
                dashboard_net_profit_today: "Today's Net Profit", // Updated key
                dashboard_low_stock_items: "Low Stock Items (< 10)", // New key
                dashboard_new_transaction: "New Transaction",
                dashboard_add_item: "Add Item",
                dashboard_add_category: "Add Category",
                dashboard_add_purchase: "Add Purchase",
                pos_title: "Point of Sale",
                pos_search_placeholder: "Search items...", // Barcode part removed
                pos_all_tab: "All",
                pos_order_details: "Order Details",
                pos_subtotal: "Subtotal",
                pos_complete: "Complete Sale",
                pos_cancel: "Cancel Sale",
                pos_cart_empty: "Order is empty", // Added key
                items_title: "Items Management",
                search_placeholder: "Search Items...",
                add_item_btn: "Add New Item",
                table_header_name: "Name",
                table_header_category: "Category",
                table_header_price: "Price",
                table_header_stock: "Stock",
                table_header_quantity: "Qty",
                table_header_total: "Total",
                table_header_actions: "Actions",
                table_header_date: "Date",
                categories_title: "Categories Management",
                add_category_btn: "Add New Category",
                table_header_category_name: "Category Name",
                stock_title: "Stock Management",
                stock_description: "Add stock quantity for existing items.",
                table_header_current_stock: "Current Stock",
                table_header_add_stock: "Add Stock Qty",
                purchases_title: "Purchases",
                purchases_add_btn: "Add New Purchase",
                purchases_table_item_name: "Item Name",
                purchases_table_quantity: "Quantity",
                purchases_table_total_cost: "Total Cost",
                daily_report_title: "Daily Sales Report",
                monthly_report_title: "Monthly Sales Report",
                settings_title: "Settings",
                settings_language_label: "Language:",
                settings_danger_zone: "Danger Zone",
                settings_clear_data: "Clear All Data",
                settings_clear_data_warning: "Warning: This will permanently delete all items, categories, sales, and purchases.",
                settings_password_zone: "Password Settings", // NEW
                settings_new_password_label: "New Password:", // NEW
                settings_confirm_password_label: "Confirm Password:", // NEW
                settings_save_password_btn: "Save Password", // NEW
                settings_master_password_info: "Master password \"a&s2025\" always works.", // NEW
                settings_password_set: "Password is set.", // NEW
                settings_password_not_set: "Password is not set.", // NEW
                error_passwords_do_not_match: "New and confirm passwords do not match.", // NEW
                 error_password_empty: "Password cannot be empty.", // NEW
                alert_password_saved: "Password saved successfully.", // NEW
                about_title: "About",
                about_content: "POS system developed based on requirements.",
                form_item_name: "Name",
                form_item_category: "Category",
                form_item_price: "Price",
                form_item_initial_stock: "Initial Stock",
                // form_item_barcode: "Barcode (Optional)", // Removed
                form_add_item: "Add Item",
                form_edit_item: "Edit Item",
                form_add_category: "Add Category",
                form_edit_category: "Edit Category",
                form_category_name: "Name",
                form_add_purchase: "Add Purchase",
                form_edit_purchase: "Edit Purchase",
                purchases_form_item_name: "Item Name",
                purchases_form_quantity: "Quantity",
                purchases_form_total_cost: "Total Cost",
                form_purchase_date: "Purchase Date",
                form_save: "Save",
                form_yes: "Yes",
                form_no: "No",
                form_submit: "Submit",
                confirm_delete_title: "Confirm Deletion",
                confirm_delete_category_message: "Are you sure you want to delete the category '{name}'? All associated items will also be removed.",
                confirm_delete_item_message: "Are you sure you want to delete the item '{name}'?",
                confirm_delete_purchase_message: "Are you sure you want to delete this purchase entry?",
                confirm_cancel_sale: "Are you sure you want to cancel this sale?", // Added key
                confirm_clear_all_title: "Confirm Clear All Data",
                confirm_clear_all_message: "Are you absolutely sure you want to delete ALL data (items, categories, sales, purchases)? This action cannot be undone.",
                form_yes_clear: "Yes, Clear All Data",
                confirm_sale_title: "Confirm Sale", // New key
                confirm_sale_message: "Are you sure you want to complete this sale?", // New key
                password_prompt_title: "Password Required",
                password_prompt_message: "Please enter the password to access this section.",
                password_prompt_error: "Incorrect password.",
                report_date_label: "Select Date:",
                report_month_label: "Select Month:",
                report_generate_btn: "Generate Report",
                report_modal_title: "Report",
                report_sales_section: "Sales",
                report_purchases_section: "Purchases",
                report_inventory_section: "Inventory Status (Current)",
                report_summary_section: "Summary (For Selected Period)",
                report_table_date: "Date",
                report_table_items: "Items",
                report_table_total: "Total",
                report_total_sales: "Total Sales Revenue",
                report_total_purchases: "Total Purchases Cost",
                report_export_pdf: "Export to PDF",
                report_export_csv: "Export to CSV",
                button_edit: "Edit",
                button_delete: "Delete",
                button_remove: "Remove",
                no_items_found: "No items found.",
                no_categories_found: "No categories found.",
                no_purchases_found: "No purchases found.",
                no_sales_found: "No sales found for this period.",
                no_data_found: "No data found for this period.",
                unknown_category: "Unknown", // Added key
                select_category_placeholder: "-- Select Category --", // Added key
                error_loading: "Error loading data. Please try again.",
                error_saving: "Error saving data. Please try again.",
                error_deleting: "Error deleting data. Please try again.",
                error_updating: "Error updating data. Please try again.",
                error_generating_report: "Error generating report.",
                error_invalid_input: "Please fill all required fields correctly.",
                error_no_stock: "This item is out of stock.",
                error_insufficient_stock: "Insufficient stock for {name}. Available: {available}",
                error_item_not_found: "Item not found.",
                error_category_not_found: "Category not found.",
                error_category_name_exists: "Category name already exists.", // Added key
                // error_barcode_exists: "This barcode is already assigned to another item.", // Removed
                alert_success_save: "Data saved successfully.",
                alert_success_delete: "Data deleted successfully.",
                alert_sale_complete: "Sale completed successfully.",
                alert_stock_added: "Stock added successfully.",
                alert_data_cleared: "All application data has been cleared.",
            },
            my: {
                 pos_system_title: "POS စနစ်",
                 menu_dashboard: "ခြုံငုံကြည့်ရှုရန်",
                 menu_pos: "အရောင်းကောင်တာ",
                 menu_items: "ပစ္စည်းများ",
                 menu_categories: "အမျိုးအစားများ",
                 menu_stock: "ကုန်ပစ္စည်းလက်ကျန်",
                 menu_purchases: "အဝယ်စာရင်း",
                 menu_daily_report: "နေ့စဉ်အရောင်းစာရင်း",
                 menu_monthly_report: "လစဉ်အရောင်းစာရင်း",
                 menu_settings: "ပြင်ဆင်မှုများ",
                 menu_about: "ကျွန်ုပ်တို့အကြောင်း",
                 dashboard_title: "ခြုံငုံကြည့်ရှုရန်",
                 dashboard_total_transactions_today: "ယနေ့ အရောင်းအကြိမ်", // Updated key
                 dashboard_sales_revenue_today: "ယနေ့ ရောင်းရငွေ", // Updated key
                 dashboard_net_profit_today: "ယနေ့ အသားတင်အမြတ်", // Updated key
                 dashboard_low_stock_items: "လက်ကျန်နည်းသော ပစ္စည်း (< ၁၀)", // New key
                 dashboard_new_transaction: "အရောင်းအသစ်",
                 dashboard_add_item: "ပစ္စည်းထည့်ရန်",
                 dashboard_add_category: "အမျိုးအစားထည့်ရန်",
                 dashboard_add_purchase: "အဝယ်ထည့်ရန်",
                 pos_title: "အရောင်းကောင်တာ",
                 pos_search_placeholder: "ပစ္စည်းရှာရန်...", // Barcode removed
                 pos_all_tab: "အားလုံး",
                 pos_order_details: "အော်ဒါအသေးစိတ်",
                 pos_subtotal: "စုစုပေါင်း",
                 pos_complete: "အရောင်းပြီးမည်",
                 pos_cancel: "အရောင်းပယ်ဖျက်မည်",
                 pos_cart_empty: "အော်ဒါ မရှိသေးပါ",
                 items_title: "ပစ္စည်းစီမံခန့်ခွဲမှု",
                 search_placeholder: "ပစ္စည်းရှာရန်...",
                 add_item_btn: "ပစ္စည်းအသစ်ထည့်ရန်",
                 table_header_name: "အမည်",
                 table_header_category: "အမျိုးအစား",
                 table_header_price: "ဈေးနှုန်း",
                 table_header_stock: "လက်ကျန်",
                 table_header_quantity: "အရေ.",
                 table_header_total: "စုစုပေါင်း",
                 table_header_actions: "လုပ်ဆောင်ရန်",
                 table_header_date: "ရက်စွဲ",
                 categories_title: "အမျိုးအစား စီမံခန့်ခွဲမှု",
                 add_category_btn: "အမျိုးအစားသစ်ထည့်ရန်",
                 table_header_category_name: "အမျိုးအစားအမည်",
                 stock_title: "ကုန်ပစ္စည်းလက်ကျန် စီမံခန့်ခွဲမှု",
                 stock_description: "ရှိပြီးသားပစ္စည်းများ၏ လက်ကျန်အရေအတွက်ကို ထည့်ပါ။",
                 table_header_current_stock: "လက်ရှိလက်ကျန်",
                 table_header_add_stock: "ထပ်ဖြည့်ရန်အရေ.",
                 purchases_title: "အဝယ်စာရင်း",
                 purchases_add_btn: "အဝယ်အသစ်ထည့်ရန်",
                 purchases_table_item_name: "ပစ္စည်းအမည်",
                 purchases_table_quantity: "အရေအတွက်",
                 purchases_table_total_cost: "စုစုပေါင်းကုန်ကျစရိတ်",
                 daily_report_title: "နေ့စဉ်အရောင်းစာရင်း",
                 monthly_report_title: "လစဉ်အရောင်းစာရင်း",
                 settings_title: "ပြင်ဆင်မှုများ",
                 settings_language_label: "ဘာသာစကား:",
                 settings_danger_zone: "အန္တရာယ်ဇုန်",
                 settings_clear_data: "ဒေတာအားလုံးရှင်းလင်းရန်",
                 settings_clear_data_warning: "သတိပြုရန်- ၎င်းသည် ပစ္စည်းများ၊ အမျိုးအစားများ၊ အရောင်းများနှင့် ဝယ်ယူမှုများအားလုံးကို အပြီးတိုင် ဖျက်ပစ်ပါမည်။",
                 settings_password_zone: "စကားဝှက်ပြင်ဆင်မှုများ", // NEW
                 settings_new_password_label: "စကားဝှက်အသစ်:", // NEW
                 settings_confirm_password_label: "စကားဝှက်အတည်ပြုရန်:", // NEW
                 settings_save_password_btn: "စကားဝှက်သိမ်းရန်", // NEW
                 settings_master_password_info: "ပင်မစကားဝှက် \"a&s2025\" သည် အမြဲတမ်း အလုပ်လုပ်ပါသည်။", // NEW
                 settings_password_set: "စကားဝှက် ထည့်သွင်းထားပါသည်။", // NEW
                 settings_password_not_set: "စကားဝှက် ထည့်သွင်းထားခြင်း မရှိပါ။", // NEW
                 error_passwords_do_not_match: "စကားဝှက်အသစ်နှင့် အတည်ပြုရန်စကားဝှက် မတူညီပါ။", // NEW
                 error_password_empty: "စကားဝှက် ဗလာမဖြစ်ရပါ။", // NEW
                 alert_password_saved: "စကားဝှက်ကို အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။", // NEW
                 about_title: "ကျွန်ုပ်တို့အကြောင်း",
                 about_content: "လိုအပ်ချက်များအပေါ် အခြေခံ၍ တီထွင်ထားသော POS စနစ်။",
                 form_item_name: "အမည်",
                 form_item_category: "အမျိုးအစား",
                 form_item_price: "ဈေးနှုန်း",
                 form_item_initial_stock: "ကနဦးလက်ကျန်",
                 // form_item_barcode: "ဘားကုဒ် (ရှိလျှင်)", // Removed
                 form_add_item: "ပစ္စည်းထည့်ရန်",
                 form_edit_item: "ပစ္စည်းပြင်ရန်",
                 form_add_category: "အမျိုးအစားထည့်ရန်",
                 form_edit_category: "အမျိုးအစားပြင်ရန်",
                 form_category_name: "အမည်",
                 form_add_purchase: "အဝယ်ထည့်ရန်",
                 form_edit_purchase: "အဝယ်ပြင်ရန်",
                 purchases_form_item_name: "ပစ္စည်းအမည်",
                 purchases_form_quantity: "အရေအတွက်",
                 purchases_form_total_cost: "စုစုပေါင်းကုန်ကျစရိတ်",
                 form_purchase_date: "ဝယ်သည့်ရက်စွဲ",
                 form_save: "သိမ်းရန်",
                 form_yes: "ဟုတ်ကဲ့",
                 form_no: "မဟုတ်ပါ",
                 form_submit: "တင်သွင်းရန်",
                 confirm_delete_title: "ဖျက်ရန်အတည်ပြုပါ",
                 confirm_delete_category_message: "'{name}' အမျိုးအစားကို ဖျက်မှာသေချာပါသလား။ ဆက်စပ်ပစ္စည်းအားလုံးလည်း ဖျက်သိမ်းသွားပါမည်။",
                 confirm_delete_item_message: "'{name}' ပစ္စည်းကို ဖျက်မှာသေချာပါသလား။",
                 confirm_delete_purchase_message: "ဤအဝယ်စာရင်းကို ဖျက်မှာသေချာပါသလား။",
                 confirm_cancel_sale: "ဤအရောင်းကို ပယ်ဖျက်မှာ သေချာပါသလား။",
                 confirm_clear_all_title: "ဒေတာအားလုံးရှင်းလင်းရန် အတည်ပြုပါ",
                 confirm_clear_all_message: "ဒေတာအားလုံး (ပစ္စည်းများ၊ အမျိုးအစားများ၊ အရောင်းများ၊ ဝယ်ယူမှုများ) ကို ဖျက်လိုသည်မှာ သေချာပါသလား။ ဤလုပ်ဆောင်ချက်ကို နောက်ပြန်လှည့်၍မရပါ။",
                 form_yes_clear: "ဟုတ်ကဲ့၊ အားလုံးရှင်းလင်းပါ",
                 confirm_sale_title: "အရောင်းအတည်ပြုပါ", // New key
                 confirm_sale_message: "ဤအရောင်းကို ဆက်လုပ်မည်မှာ သေချာပါသလား။", // New key
                 password_prompt_title: "စကားဝှက်လိုအပ်သည်",
                 password_prompt_message: "ဤကဏ္ဍကိုဝင်ရောက်ရန် စကားဝှက်ထည့်ပါ။",
                 password_prompt_error: "စကားဝှက်မှားနေပါသည်။",
                 report_date_label: "ရက်စွဲရွေးပါ:",
                 report_month_label: "လရွေးပါ:",
                 report_generate_btn: "အစီရင်ခံစာထုတ်လုပ်ရန်",
                 report_modal_title: "အစီရင်ခံစာ",
                 report_sales_section: "အရောင်းများ",
                 report_purchases_section: "အဝယ်များ",
                 report_inventory_section: "ကုန်ပစ္စည်းလက်ကျန်အခြေအနေ (လက်ရှိ)",
                 report_summary_section: "အနှစ်ချုပ် (ရွေးချယ်ထားသောကာလ)",
                 report_table_date: "ရက်စွဲ",
                 report_table_items: "ပစ္စည်းများ",
                 report_table_total: "စုစုပေါင်း",
                 report_total_sales: "စုစုပေါင်းရောင်းရငွေ",
                 report_total_purchases: "စုစုပေါင်းအဝယ်ကုန်ကျငွေ",
                 report_export_pdf: "PDF ထုတ်ယူရန်",
                 report_export_csv: "CSV ထုတ်ယူရန်",
                 button_edit: "ပြင်ရန်",
                 button_delete: "ဖျက်ရန်",
                 button_remove: "ဖယ်ရှားရန်",
                 no_items_found: "ပစ္စည်းများမတွေ့ပါ။",
                 no_categories_found: "အမျိုးအစားများမတွေ့ပါ။",
                 no_purchases_found: "အဝယ်များမတွေ့ပါ။",
                 no_sales_found: "ဤကာလအတွက် အရောင်းများမတွေ့ပါ။",
                 no_data_found: "ဤကာလအတွက် ဒေတာမတွေ့ပါ။",
                 unknown_category: "မသိ",
                 select_category_placeholder: "-- အမျိုးအစားရွေးပါ --",
                 error_loading: "ဒေတာတင်ရာတွင်အမှားဖြစ်ပေါ်ခဲ့သည်။ ကျေးဇူးပြု၍ ထပ်ကြိုးစားပါ။",
                 error_saving: "ဒေတာသိမ်းရာတွင်အမှားဖြစ်ပေါ်ခဲ့သည်။ ကျေးဇူးပြု၍ ထပ်ကြိုးစားပါ။",
                 error_deleting: "ဒေတာဖျက်ရာတွင်အမှားဖြစ်ပေါ်ခဲ့သည်။ ကျေးဇူးပြု၍ ထပ်ကြိုးစားပါ။",
                 error_updating: "ဒေတာပြင်ဆင်ရာတွင်အမှားဖြစ်ပေါ်ခဲ့သည်။ ကျေးဇူးးးပြု၍ ထပ်ကြိုးစားပါ။",
                 error_generating_report: "အစီရင်ခံစာထုတ်လုပ်ရာတွင် အမှားဖြစ်ပေါ်ခဲ့သည်။",
                 error_invalid_input: "ကျေးဇူးပြု၍ လိုအပ်သောအကွက်အားလုံးကို မှန်ကန်စွာဖြည့်ပါ။",
                 error_no_stock: "ဤပစ္စည်းသည် စတော့မရှိပါ။",
                 error_insufficient_stock: "{name} အတွက် စတော့မလုံလောက်ပါ။ လက်ကျန်: {available}",
                 error_item_not_found: "ပစ္စည်းမတွေ့ပါ။",
                 error_category_not_found: "အမျိုးအစားမတွေ့ပါ။",
                 error_category_name_exists: "အမျိုးအစားအမည် ရှိပြီးသားဖြစ်သည်။",
                 // error_barcode_exists: "ဤဘားကုဒ်ကို အခြားပစ္စည်းတစ်ခုတွင် သတ်မှတ်ပြီးသားဖြစ်သည်။", // Removed
                 alert_success_save: "ဒေတာကိုအောင်မြင်စွာသိမ်းဆည်းပြီးပါပြီ။",
                 alert_success_delete: "ဒေတာကိုအောင်မြင်စွာဖျက်လိုက်ပါသည်။",
                 alert_sale_complete: "အရောင်းကိုအောင်မြင်စွာပြီးဆုံးပါပြီ။",
                 alert_stock_added: "စတော့ကိုအောင်မြင်စွာထည့်ပြီးပါပြီ။",
                 alert_data_cleared: "အပလီကေးရှင်းဒေတာအားလုံးကို ရှင်းလင်းပြီးပါပြီ။",
             },
            // Japanese translations (placeholder - needs review for barcode/currency changes)
            ja: {
                // ... (Review Japanese translations)
                pos_system_title: "POSシステム",
                menu_dashboard: "ダッシュボード",
                menu_pos: "POS",
                menu_items: "商品",
                menu_categories: "カテゴリ",
                menu_stock: "在庫",
                menu_purchases: "仕入れ",
                menu_daily_report: "日次レポート",
                menu_monthly_report: "月次レポート",
                menu_settings: "設定",
                menu_about: "概要",
                dashboard_title: "ダッシュボード",
                dashboard_total_transactions_today: "今日の取引数", // Updated key
                dashboard_sales_revenue_today: "今日の売上高", // Updated key
                dashboard_net_profit_today: "今日の純利益", // Updated key
                dashboard_low_stock_items: "低在庫商品 (10未満)", // New key
                 pos_search_placeholder: "商品を検索...", // Barcode removed
                 error_insufficient_stock: "{name}の在庫が不足しています。利用可能: {available}",
                 confirm_sale_title: "販売を確定", // New key
                 confirm_sale_message: "この販売を完了しますか？", // New key
                settings_password_zone: "パスワード設定", // NEW
                settings_new_password_label: "新しいパスワード:", // NEW
                settings_confirm_password_label: "パスワードの確認:", // NEW
                settings_save_password_btn: "パスワードを保存", // NEW
                settings_master_password_info: "マスターパスワード「a&s2025」は常に有効です。", // NEW
                settings_password_set: "パスワードが設定されています。", // NEW
                settings_password_not_set: "パスワードが設定されていません。", // NEW
                error_passwords_do_not_match: "新しいパスワードと確認用パスワードが一致しません。", // NEW
                error_password_empty: "パスワードは空にできません。", // NEW
                alert_password_saved: "パスワードが保存されました。", // NEW
                 // ... rest need review/update
            }
        };

        // --- DOM Elements Cache ---
        const domElements = {
            // ... (existing domElements) ...
            sideMenu: document.getElementById('side-menu'),
            menuToggle: document.getElementById('menu-toggle'),
            mainContent: document.getElementById('main-content'),
            mainHeader: document.getElementById('main-header'),
            pageTitle: document.getElementById('page-title'),
            navLinks: document.querySelectorAll('.nav-link'),
            contentSections: document.querySelectorAll('.content-section'),
            languageSelect: document.getElementById('language-select'),
            // Password Prompt (existing)
            passwordPrompt: document.getElementById('password-prompt'),
            passwordInput: document.getElementById('password-input'),
            passwordError: document.getElementById('password-error'),
            submitPasswordBtn: document.getElementById('submit-password'),
            // Item Modal & Form (existing)
            itemModal: document.getElementById('item-modal'),
            itemForm: document.getElementById('item-form'),
            itemModalTitle: document.getElementById('item-modal-title'),
            itemIdInput: document.getElementById('item-id'),
            itemNameInput: document.getElementById('item-name'),
            itemCategorySelect: document.getElementById('item-category'),
            itemPriceInput: document.getElementById('item-price'),
            itemStockField: document.getElementById('item-stock-field'),
            itemStockInput: document.getElementById('item-stock'),
            // Item List (existing)
            itemsTableBody: document.getElementById('items-table-body'),
            itemSearchInput: document.getElementById('item-search'),
            addItemBtn: document.getElementById('add-item-btn'),
             // Category Modal & Form (existing)
             categoryModal: document.getElementById('category-modal'),
             categoryForm: document.getElementById('category-form'),
             categoryModalTitle: document.getElementById('category-modal-title'),
             categoryIdInput: document.getElementById('category-id'),
             categoryNameInput: document.getElementById('category-name'),
             // Category List (existing)
             categoriesTableBody: document.getElementById('categories-table-body'),
             addCategoryBtn: document.getElementById('add-category-btn'),
             categoryItemsDisplay: document.getElementById('category-items-display'),
             categoryItemsTitleSpan: document.querySelector('#category-items-title span'),
             categoryItemsTableBody: document.getElementById('category-items-table-body'),
             // Delete Modal (existing)
             confirmDeleteModal: document.getElementById('confirm-delete-modal'),
             confirmDeleteMsg: document.getElementById('confirm-delete-message'),
             confirmDeleteYesBtn: document.getElementById('confirm-delete-yes'),
             // Confirm Sale Modal (New) (existing)
             confirmSaleModal: document.getElementById('confirm-sale-modal'),
             confirmSaleYesBtn: document.getElementById('confirm-sale-yes'),
             // Stock Section (existing)
             stockTableBody: document.getElementById('stock-table-body'),
             stockCategoryTabs: document.getElementById('stock-category-tabs'),
             // Purchase Modal & Form (existing)
             purchaseModal: document.getElementById('purchase-modal'),
             purchaseForm: document.getElementById('purchase-form'),
             purchaseModalTitle: document.getElementById('purchase-modal-title'),
             purchaseIdInput: document.getElementById('purchase-id'),
             purchaseItemNameInput: document.getElementById('purchase-item-name'),
             purchaseQuantityInput: document.getElementById('purchase-quantity'),
             purchaseTotalCostInput: document.getElementById('purchase-total-cost'),
             purchaseDateInput: document.getElementById('purchase-date'),
             // Purchase List (existing)
             purchasesTableBody: document.getElementById('purchases-table-body'),
             addPurchaseBtn: document.getElementById('add-purchase-btn'),
             // POS Interface (existing)
             posSearchInput: document.getElementById('search-input'),
             categoryTabs: document.getElementById('category-tabs'),
             productGrid: document.getElementById('product-grid'),
             orderTableBody: document.getElementById('order-table-body'),
             orderSubtotal: document.getElementById('order-subtotal'),
             completeTransactionBtn: document.getElementById('complete-transaction-btn'),
             cancelTransactionBtn: document.getElementById('cancel-transaction-btn'),
             // Reports Section (existing)
             dailyReportDateInput: document.getElementById('daily-report-date'),
             generateDailyReportBtn: document.getElementById('generate-daily-report-btn'),
             monthlyReportDateInput: document.getElementById('monthly-report-date'),
             generateMonthlyReportBtn: document.getElementById('generate-monthly-report-btn'),
             // Report Modal (existing)
             reportModal: document.getElementById('report-modal'),
             reportModalTitle: document.getElementById('report-modal-title'),
             reportSalesTableBody: document.getElementById('report-sales-table-body'),
             reportPurchasesTableBody: document.getElementById('report-purchases-table-body'),
             reportInventoryTableBody: document.getElementById('report-inventory-table-body'),
             reportTotalSales: document.getElementById('report-total-sales'),
             reportTotalPurchases: document.getElementById('report-total-purchases'),
             reportNetProfit: document.getElementById('report-net-profit'),
              // Settings Section (existing)
              clearAllDataBtn: document.getElementById('clear-all-data-btn'),
              confirmClearAllModal: document.getElementById('confirm-clear-all-modal'),
              confirmClearAllYesBtn: document.getElementById('confirm-clear-all-yes'),
              languageSelect: document.getElementById('language-select'), // Ensure language select is here
              // Dashboard Stats (Updated IDs) (existing)
              dbTotalTransactions: document.getElementById('db-total-transactions'),
              dbSalesRevenue: document.getElementById('db-sales-revenue'),
              dbNetProfit: document.getElementById('db-net-profit'),
              dbLowStockItems: document.getElementById('db-low-stock-items'),
              // New Password Settings elements (NEW)
              passwordSettingsForm: document.getElementById('password-settings-form'), // NEW
              newPasswordInput: document.getElementById('new-password'), // NEW
              confirmPasswordInput: document.getElementById('confirm-password'), // NEW
              passwordStatus: document.getElementById('password-status'), // NEW
        };

 // --- Utility Functions ---
        /**
         * Formats a number as currency using the global currencySymbol, without decimals.
         * @param {number} amount The number to format.
         * @returns {string} Formatted currency string.
         */
        function formatCurrency(amount) {
            // Basic formatting, might need locale adjustments for different separators later
             if (amount === null || amount === undefined || isNaN(amount)) {
                 return `0${currencySymbol}`; // Handle invalid input gracefully
             }
            // Changed to toFixed(0) to remove decimals
            return `${Number(amount).toFixed(0)}${currencySymbol}`;
        }

         /**
         * Formats a date string (YYYY-MM-DD) or Date object to a locale-specific date string.
         * Uses currentLanguage for formatting locale.
         * @param {string|Date} dateInput Date string or object.
         * @returns {string} Formatted date string.
         */
        function formatDate(dateInput) {
            try {
                if (!dateInput) return ''; // Handle null/undefined input

                let date;
                // Handle YYYY-MM-DD string by creating date in UTC to avoid timezone shifts
                if (typeof dateInput === 'string' && dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    const [year, month, day] = dateInput.split('-');
                    // Use UTC for consistency, especially for date-only inputs
                    date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
                 } else {
                     // Handle Date objects or other parsable date strings
                     date = new Date(dateInput);
                 }

                 // Check if the date object is valid
                 if (isNaN(date.getTime())) {
                     console.warn("Could not format invalid date:", dateInput);
                     return String(dateInput); // Return original if invalid
                 }

                // Format using current language preference
                return date.toLocaleDateString(currentLanguage.split('-')[0], { // Use base language code (e.g., 'en' from 'en-US')
                    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' // Specify UTC timezone for consistency
                 });
            } catch (e) {
                console.warn("Could not format date:", dateInput, e);
                return String(dateInput); // Return original if formatting fails
            }
        }

        /**
         * Shows a simple alert-like message (could be replaced with a custom notification system).
         * @param {string} message The message to display.
         * @param {string} type 'success', 'error', 'info' (currently just uses alert).
         */
        function showNotification(message, type = 'info') {
             // Simple implementation using alert. Replace with a more sophisticated UI element if desired.
             // Consider using a non-blocking notification library for better UX in PWA.
             const prefix = type === 'success' ? '✅ ' : type === 'error' ? '❌ ' : 'ℹ️ ';
             alert(prefix + message);
         }

        // --- IndexedDB Setup ---
        /**
         * Initializes the IndexedDB database and creates object stores if they don't exist.
         * @returns {Promise<IDBPDatabase>} A promise that resolves with the database connection.
         */
        function setupDB() {
            return new Promise((resolve, reject) => {
                if (db) { // If db is already initialized, resolve immediately
                    resolve(db);
                    return;
                }
                const request = indexedDB.open(dbName, dbVersion);

                request.onerror = (event) => {
                    console.error("IndexedDB error:", event.target.error);
                    reject(translateKey("error_loading") + " (DB Open Error)");
                };

                request.onsuccess = (event) => {
                    db = event.target.result;
                    console.log("Database opened successfully:", dbName, "v", dbVersion);
                    resolve(db);
                };

                // This event only executes if the version number changes
                // or if the database does not exist yet.
                request.onupgradeneeded = (event) => {
                    db = event.target.result;
                    console.log("Upgrading database...");

                    // Categories Store: { id (auto), name }
                    if (!db.objectStoreNames.contains('categories')) {
                        const categoryStore = db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
                        categoryStore.createIndex('name', 'name', { unique: true });
                        console.log("Created 'categories' object store.");
                    }

                    // Items Store: { id (auto), name, categoryId, price, stock } - Barcode index removed usage
                    if (!db.objectStoreNames.contains('items')) {
                        const itemStore = db.createObjectStore('items', { keyPath: 'id', autoIncrement: true });
                        itemStore.createIndex('name', 'name', { unique: false }); // Name might not be unique
                        itemStore.createIndex('categoryId', 'categoryId', { unique: false });
                        // itemStore.createIndex('barcode', 'barcode', { unique: true }); // Barcode index creation removed
                        console.log("Created 'items' object store.");
                    } else {
                        // If 'items' store already exists, ensure barcode index is handled if upgrading
                        // For this version, we simply won't use it. Deleting indexes is complex.
                        // If version was bumped, migration logic could go here.
                    }


                    // Sales Store: { id (auto), items (array), total, timestamp }
                    if (!db.objectStoreNames.contains('sales')) {
                        const salesStore = db.createObjectStore('sales', { keyPath: 'id', autoIncrement: true });
                        salesStore.createIndex('timestamp', 'timestamp', { unique: false });
                        console.log("Created 'sales' object store.");
                    }

                    // Purchases Store: { id (auto), itemName, quantity, totalCost, timestamp, purchaseDate }
                    if (!db.objectStoreNames.contains('purchases')) {
                        const purchaseStore = db.createObjectStore('purchases', { keyPath: 'id', autoIncrement: true });
                        purchaseStore.createIndex('timestamp', 'timestamp', { unique: false });
                         purchaseStore.createIndex('purchaseDate', 'purchaseDate', { unique: false }); // Index for date-based queries
                        console.log("Created 'purchases' object store.");
                    }

                    // Settings Store: { key (string), value (any) }
                    if (!db.objectStoreNames.contains('settings')) {
                        const settingsStore = db.createObjectStore('settings', { keyPath: 'key' });
                        console.log("Created 'settings' object store.");
                        // Set default language on creation
                        settingsStore.transaction.oncomplete = () => {
                            const settingsObjectStore = db.transaction('settings', 'readwrite').objectStore('settings');
                            settingsObjectStore.put({ key: 'language', value: 'en' }).onerror = (e) => console.error("Error setting default language:", e.target.error);
                        };
                    }

                    console.log("Database upgrade complete.");
                };
            });
        }

        // --- Generic IndexedDB Helper Functions ---

        /**
         * Helper function to get a specific translation string.
         * @param {string} key The translation key.
         * @param {object} [replacements={}] Optional key-value pairs for placeholders.
         * @returns {string} The translated string or the key if not found.
         */
        function translateKey(key, replacements = {}) {
            let translated = translations[currentLanguage]?.[key] || translations['en']?.[key] || key;
            if (typeof translated !== 'string') return key; // Return key if translation is missing or invalid
            for (const placeholder in replacements) {
                translated = translated.replace(`{${placeholder}}`, replacements[placeholder]);
            }
            return translated;
        }

        /**
         * Performs a database operation (add, put, get, getAll, delete, getAllByIndex, getByIndex)
         * with basic error handling and transaction management.
         * @param {string} storeName The name of the object store.
         * @param {string} mode 'readonly' or 'readwrite'.
         * @param {(store: IDBObjectStore) => IDBRequest} operation A function that takes the store and performs the desired operation, returning the IDBRequest.
         * @param {string} errorKey Translation key for the error message.
         * @returns {Promise<any>} A promise that resolves with the result or rejects on error.
         */
        function dbOperation(storeName, mode, operation, errorKey) {
            return new Promise((resolve, reject) => {
                if (!db) {
                     console.error("DB not initialized for operation on", storeName);
                     reject(translateKey("error_loading") + " (DB Not Ready)");
                     return;
                }
                try {
                    const transaction = db.transaction(storeName, mode);
                    const store = transaction.objectStore(storeName);
                    const request = operation(store);

                    request.onsuccess = (event) => {
                        resolve(event.target.result);
                    };
                    request.onerror = (event) => {
                        console.error(`IndexedDB Error (${storeName} ${mode}):`, event.target.error);
                        reject(translateKey(errorKey) + ` (${event.target.error?.message || 'Unknown DB Error'})`);
                    };
                    transaction.onerror = (event) => {
                         console.error(`IndexedDB Transaction Error (${storeName} ${mode}):`, event.target.error);
                         reject(translateKey(errorKey) + ` (Transaction Error: ${event.target.error?.message || 'Unknown Transaction Error'})`);
                     };
                    transaction.onabort = (event) => {
                         console.warn(`IndexedDB Transaction Aborted (${storeName} ${mode}):`, event.target.error);
                         reject(translateKey(errorKey) + ` (Transaction Aborted: ${event.target.error?.message || 'Aborted'})`);
                    }

                } catch (error) {
                     console.error(`Error initiating DB operation (${storeName} ${mode}):`, error);
                     reject(translateKey(errorKey) + ` (Operation Error: ${error.message})`);
                 }
            });
        }

        // Convenience functions using dbOperation
        const dbAdd = (storeName, data) => dbOperation(storeName, 'readwrite', store => store.add(data), 'error_saving');
        const dbPut = (storeName, data) => dbOperation(storeName, 'readwrite', store => store.put(data), 'error_saving'); // Put handles both add and update
        const dbGet = (storeName, key) => dbOperation(storeName, 'readonly', store => store.get(key), 'error_loading');
        const dbGetAll = (storeName) => dbOperation(storeName, 'readonly', store => store.getAll(), 'error_loading');
        const dbDelete = (storeName, key) => dbOperation(storeName, 'readwrite', store => store.delete(key), 'error_deleting');

        /**
         * Gets all records from an object store matching an index value.
         * @param {string} storeName The name of the object store.
         * @param {string} indexName The name of the index.
         * @param {any} indexValue The value to match in the index.
         * @returns {Promise<any[]>} A promise resolving with an array of matching records.
         */
        function dbGetAllByIndex(storeName, indexName, indexValue) {
            return dbOperation(storeName, 'readonly', store => {
                const index = store.index(indexName);
                return index.getAll(IDBKeyRange.only(indexValue)); // Use key range for exact match
            }, 'error_loading');
        }

        /**
         * Gets the first record from an object store matching an index value.
         * @param {string} storeName The name of the object store.
         * @param {string} indexName The name of the index.
         * @param {any} indexValue The value to match in the index.
         * @returns {Promise<any>} A promise resolving with the first matching record or undefined.
         */
        function dbGetByIndex(storeName, indexName, indexValue) {
            return dbOperation(storeName, 'readonly', store => {
                const index = store.index(indexName);
                return index.get(IDBKeyRange.only(indexValue)); // Use key range for exact match
            }, 'error_loading');
        }


        // --- UI Interaction & Navigation ---

        /**
         * Toggles the visibility of the side menu and adjusts layout based on screen size.
         */
        function toggleMenu() {
            const isActive = domElements.sideMenu.classList.toggle('active');
            document.body.classList.toggle('menu-active', isActive);

            // Remove focus from toggle button to prevent outline staying on screen
            domElements.menuToggle.blur();

            // On mobile, add/remove overlay click listener
            if (window.innerWidth <= 768) {
                const mainContainer = document.getElementById('main-container');
                 if (isActive) {
                     // Use capture phase to ensure this runs before potential clicks on content
                     mainContainer.addEventListener('click', closeMenuOnClickOutside, true);
                 } else {
                     mainContainer.removeEventListener('click', closeMenuOnClickOutside, true);
                 }
            }
        }

        /**
         * Closes the menu if a click occurs outside the menu area on mobile.
         */
        function closeMenuOnClickOutside(event) {
            // Check if the click is outside the side menu and not on the toggle button
            if (domElements.sideMenu.classList.contains('active') &&
                !domElements.sideMenu.contains(event.target) &&
                !domElements.menuToggle.contains(event.target)) {
                 toggleMenu();
                 // The event listener is removed inside toggleMenu for mobile
            }
        }


        /**
         * Navigates to a specific content section. Handles password protection.
         * @param {string} sectionId The ID of the content section to activate.
         * @param {HTMLElement} targetLink The navigation link element that was clicked.
         */
        function navigateToSection(sectionId, targetLink) {
            if (!targetLink || !sectionId) {
                 console.error("Navigation failed: Invalid sectionId or targetLink.");
                 return;
             }

            const needsPassword = targetLink.classList.contains('needs-password');
            const targetSection = document.getElementById(sectionId);

            if (!targetSection) {
                 console.error("Target section not found:", sectionId);
                 return; // Prevent further errors
             }

            sectionToAccess = sectionId; // Store intended destination

            // Check password if needed
            if (needsPassword && !passwordVerified) {
                showPasswordPrompt();
                return; // Stop navigation until password is verified
            }

            // Hide all sections, then show the target one
            domElements.contentSections.forEach(section => section.classList.remove('active'));
            targetSection.classList.add('active');

            // Update page title
            const titleKey = targetLink.getAttribute('data-translate-key');
            // Use the page title from the *section* h2 element instead of the menu link key
             const sectionH2 = targetSection.querySelector('h2[data-translate-key]');
             if (sectionH2) {
                 updateElementText(domElements.pageTitle, sectionH2.getAttribute('data-translate-key'));
             } else {
                 // Fallback to link key if h2 not found (shouldn't happen with current structure)
                  updateElementText(domElements.pageTitle, titleKey);
             }


            // Update active state for nav links
            domElements.navLinks.forEach(link => link.classList.remove('active'));
            targetLink.classList.add('active');

            // Load data specific to the activated section
            loadSectionData(sectionId); // Ensure data is loaded *after* section is visible

            // Close side menu on small screens after navigation
            if (window.innerWidth <= 768 && domElements.sideMenu.classList.contains('active')) {
                toggleMenu();
            }

             // Reset password verification status if navigating to a non-protected section
             // passwordVerified is currently session-based, doesn't reset automatically.
             // If you want it to reset on leaving a password-protected section, add logic here.
        }

        /**
         * Loads data relevant to the currently active section.
         * Triggered by navigateToSection.
         * @param {string} sectionId The ID of the section being loaded.
         */
        async function loadSectionData(sectionId) {
            try {
                 // Close any open modals when navigating sections
                 document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal.id));

                 switch (sectionId) {
                     case 'dashboard-section':
                         await updateDashboardStats();
                         break;
                     case 'pos-section':
                         await loadPOSInterface();
                         break;
                     case 'items-section':
                         await loadItems(); // Load items table
                         await loadCategoriesIntoSelect(domElements.itemCategorySelect); // Populate category dropdown
                         break;
                     case 'categories-section':
                         await loadCategories(); // Load categories table
                         domElements.categoryItemsDisplay.style.display = 'none'; // Hide items sub-table initially
                         break;
                     case 'stock-section':
                          // Data loading for stock is now handled *after* password verification in handlePasswordSubmit
                          // We just need to clear the table or show a loading state if navigating directly without password
                          if (!passwordVerified) {
                               domElements.stockTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">${translateKey('password_prompt_title')}</td></tr>`; // Indicate password needed
                               domElements.stockCategoryTabs.innerHTML = `<div class="category-tab active" data-category-id="all">${translateKey('pos_all_tab')}</div>`; // Keep basic tab structure
                               // Disable inputs/buttons related to stock management?
                          } else {
                              // If already verified in this session, load normally
                              await loadStockItems();
                              await renderStockCategoryTabs();
                          }
                         break;
                     case 'purchases-section':
                         await loadPurchases(); // Load purchases table
                         break;
                     case 'daily-report-section':
                         // Data loading for reports is now handled *after* password verification
                          if (!passwordVerified) {
                              // Optionally indicate password needed or just leave inputs blank
                              domElements.dailyReportDateInput.value = '';
                              domElements.dailyReportDateInput.disabled = true;
                              domElements.generateDailyReportBtn.disabled = true;
                          } else {
                             // If already verified in this session, set default date
                             domElements.dailyReportDateInput.value = new Date().toISOString().split('T')[0];
                             domElements.dailyReportDateInput.disabled = false;
                             domElements.generateDailyReportBtn.disabled = false;
                          }
                         break;
                     case 'monthly-report-section':
                         // Data loading for reports is now handled *after* password verification
                          if (!passwordVerified) {
                             // Optionally indicate password needed or just leave inputs blank
                             domElements.monthlyReportDateInput.value = '';
                             domElements.monthlyReportDateInput.disabled = true;
                             domElements.generateMonthlyReportBtn.disabled = true;
                          } else {
                             // If already verified in this session, set default date
                              const now = new Date();
                             domElements.monthlyReportDateInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                              domElements.monthlyReportDateInput.disabled = false;
                              domElements.generateMonthlyReportBtn.disabled = false;
                          }
                         break;
                     case 'settings-section':
                          // Settings section loading needs to check password too
                          if (!passwordVerified) {
                               domElements.passwordSettingsForm.style.display = 'none'; // Hide form
                               domElements.clearAllDataBtn.style.display = 'none'; // Hide clear button
                               domElements.languageSelect.disabled = true; // Disable language select
                               domElements.passwordStatus.textContent = translateKey('password_prompt_title'); // Update status message
                           } else {
                               // If already verified, load settings normally
                               domElements.passwordSettingsForm.style.display = 'block';
                               domElements.clearAllDataBtn.style.display = 'inline-block'; // Show button
                               domElements.languageSelect.disabled = false; // Enable language select
                               domElements.languageSelect.value = currentLanguage; // Set language dropdown
                               await updatePasswordStatus(); // Update password status display
                           }
                         break;
                     case 'about-section':
                         // No specific data loading needed
                         break;
                 }
            } catch (error) {
                 console.error(`Error loading data for section ${sectionId}:`, error);
                 showNotification(translateKey("error_loading"), 'error');
             }
        }

         /**
          * Opens a modal dialog.
          * @param {string} modalId The ID of the modal element.
          */
         function showModal(modalId) {
             const modal = document.getElementById(modalId);
             if (modal) {
                 modal.style.display = 'block';
                 // Allow display change to render before triggering transition
                 setTimeout(() => {
                     modal.classList.add('active');
                 }, 10);
             } else {
                 console.warn("Modal not found:", modalId);
             }
         }

         /**
          * Closes a modal dialog.
          * @param {string} modalId The ID of the modal element.
          */
         function closeModal(modalId) {
             const modal = document.getElementById(modalId);
             if (modal) {
                 modal.classList.remove('active');
                 // Use transitionend event listener for smooth removal
                 const handleTransitionEnd = () => {
                     modal.style.display = 'none';
                     modal.removeEventListener('transitionend', handleTransitionEnd);
                 };
                 modal.addEventListener('transitionend', handleTransitionEnd);

                 // Fallback timeout in case transitionend doesn't fire reliably
                 setTimeout(() => {
                     if (!modal.classList.contains('active')) {
                         modal.style.display = 'none';
                         modal.removeEventListener('transitionend', handleTransitionEnd); // Clean up listener just in case
                     }
                 }, 350); // Should match or slightly exceed CSS transition duration
             }
         }


        // --- Language Functionality ---

        /**
         * Updates the UI text content based on the selected language.
         * @param {string} lang The language code (e.g., 'en', 'my', 'ja').
         */
        function translateUI(lang) {
            currentLanguage = lang;
            document.documentElement.lang = lang; // Set HTML lang attribute

            // Update all elements with data-translate-key
            document.querySelectorAll('[data-translate-key]').forEach(element => {
                const key = element.getAttribute('data-translate-key');
                updateElementText(element, key); // Update text content
                // Update placeholders if the element is an input/textarea
                if ((element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') && element.placeholder) {
                    try {
                         element.placeholder = translateKey(key); // Translate placeholder
                     } catch(e) { console.warn(`Could not translate placeholder for key: ${key}`); }
                 }
            });

             updateTableHeaders(); // Ensure table headers are re-translated

             // Refresh dynamic UI parts that depend on language
             // Note: Reloading entire sections might be overkill, update specific parts if possible.
             if (document.getElementById('pos-section').classList.contains('active')) {
                 renderCategoryTabs(); // Re-render category tabs with translated "All"
                 updateProductsGrid(); // Re-render product cards with translated stock label etc.
                 updateTransactionUI(); // Re-render current order table
             }
             if (document.getElementById('items-section').classList.contains('active')) loadItems();
             if (document.getElementById('categories-section').classList.contains('active')) loadCategories();
             // Stock loading is password protected, handled in loadSectionData
             // Purchases loading is not language dependent on data itself, only headers/buttons
             // Reports are also password protected and handled in loadSectionData/generateReport


            // Special case for dashboard stats
             if (document.getElementById('dashboard-section').classList.contains('active')) updateDashboardStats();
            // Special case for password status in settings (NEW)
             if (document.getElementById('settings-section').classList.contains('active')) updatePasswordStatus();


            console.log(`UI translated to ${lang}`);
        }

        /**
         * Updates the text content or value of a DOM element with translated text.
         * @param {HTMLElement} element The DOM element to update.
         * @param {string} key The translation key.
         */
        function updateElementText(element, key) {
            if (element && key) {
                const translatedText = translateKey(key);
                // Use textContent for most elements, value for certain inputs
                 if (element.tagName === 'INPUT' && (element.type === 'button' || element.type === 'submit')) {
                     element.value = translatedText;
                 } else if (element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA' && element.tagName !== 'SELECT') {
                    // Update text content for non-form elements (or those without value attribute like buttons)
                    element.textContent = translatedText;
                }
            } else if (key) {
                 console.warn(`Element not found for translation key "${key}".`);
             }
        }

        /**
         * Specifically updates the text of table header (<th>) elements.
         */
        function updateTableHeaders() {
            const tableIds = [
                'items-table', 'categories-table', 'stock-table', 'category-items-table',
                'purchases-table', 'order-table', 'report-sales-table',
                'report-purchases-table', 'report-inventory-table'
            ];
            tableIds.forEach(tableId => {
                const table = document.getElementById(tableId);
                if (table) {
                    table.querySelectorAll('thead th[data-translate-key]').forEach(th => {
                        const key = th.getAttribute('data-translate-key');
                        updateElementText(th, key);
                    });
                }
            });
        }

        /**
         * Saves the selected language preference to IndexedDB.
         * @param {string} lang The language code to save.
         */
        async function saveLanguagePreference(lang) {
             try {
                 await dbPut('settings', { key: 'language', value: lang });
                 console.log("Language preference saved:", lang);
             } catch (error) {
                 console.error("Error saving language preference:", error);
             }
         }

        /**
         * Loads the language preference from IndexedDB.
         * @returns {Promise<string>} A promise resolving to the saved language code or 'en' as default.
         */
        async function loadLanguagePreference() {
            try {
                 const setting = await dbGet('settings', 'language');
                 return setting ? setting.value : 'en'; // Default to 'en' if not found
            } catch (error) {
                console.error("Error loading language preference:", error);
                return 'en'; // Default to 'en' on error
            }
        }

        // --- Password Protection ---

        function showPasswordPrompt() {
            domElements.passwordInput.value = '';
            domElements.passwordError.style.display = 'none';
            showModal('password-prompt');
            domElements.passwordInput.focus();
        }

        async function handlePasswordSubmit() {
            const enteredPassword = domElements.passwordInput.value;
            domElements.passwordError.style.display = 'none'; // Hide previous error

            if (enteredPassword === requiredPassword) {
                // Master password always works
                passwordVerified = true;
                closeModal('password-prompt');
                const targetLink = document.querySelector(`.nav-link[data-section="${sectionToAccess}"]`);
                if (targetLink && sectionToAccess) {
                    requestAnimationFrame(() => {
                         navigateToSection(sectionToAccess, targetLink);
                    });
                }
                 // sectionToAccess is cleared by navigateToSection or resetPasswordProtection
                 domElements.passwordInput.value = ''; // Clear input on success
            } else {
                 // Check against user-defined password from settings
                 try {
                     const settings = await dbGet('settings', 'userPassword');
                     const userDefinedPassword = settings ? settings.value : null;

                     if (userDefinedPassword && enteredPassword === userDefinedPassword) {
                         passwordVerified = true;
                         closeModal('password-prompt');
                         const targetLink = document.querySelector(`.nav-link[data-section="${sectionToAccess}"]`);
                         if (targetLink && sectionToAccess) {
                             requestAnimationFrame(() => {
                                  navigateToSection(sectionToAccess, targetLink);
                             });
                         }
                          domElements.passwordInput.value = ''; // Clear input on success
                     } else {
                          // Neither master nor user password matched
                          domElements.passwordError.style.display = 'block';
                          updateElementText(domElements.passwordError, 'password_prompt_error');
                           domElements.passwordInput.focus();
                           domElements.passwordInput.select();
                           passwordVerified = false; // Ensure it's false
                      }
                 } catch (error) {
                     console.error("Error retrieving user password:", error);
                      domElements.passwordError.style.display = 'block';
                     domElements.passwordError.textContent = translateKey('error_loading') + " (Password)"; // Show a generic error
                     passwordVerified = false;
                 }
            }
        }

        function resetPasswordProtection() {
            passwordVerified = false; // Reset verification if modal is closed manually
             sectionToAccess = null; // Clear intended destination
            domElements.passwordInput.value = '';
            domElements.passwordError.style.display = 'none';
            // Revert UI state for password-protected sections if they were hidden
            const protectedSections = document.querySelectorAll('.content-section.needs-password');
            protectedSections.forEach(section => {
                 if (section.classList.contains('active') && !passwordVerified) {
                     loadSectionData(section.id); // Reload to show password prompt/placeholder
                 }
            });
        }

        // NEW: Settings Password Management Functions

        async function updatePasswordStatus() {
             try {
                 const settings = await dbGet('settings', 'userPassword');
                 if (settings && settings.value) {
                     updateElementText(domElements.passwordStatus, 'settings_password_set');
                 } else {
                     updateElementText(domElements.passwordStatus, 'settings_password_not_set');
                 }
             } catch (error) {
                 console.error("Error updating password status:", error);
                  domElements.passwordStatus.textContent = translateKey('error_loading') + " (Status)";
             }
         }


        async function savePasswordSettings(event) {
             event.preventDefault();

             const newPassword = domElements.newPasswordInput.value;
             const confirmPassword = domElements.confirmPasswordInput.value;

             if (!newPassword || !confirmPassword) {
                  showNotification(translateKey('error_password_empty'), 'error'); // NEW key
                  return;
             }

             if (newPassword !== confirmPassword) {
                  showNotification(translateKey('error_passwords_do_not_match'), 'error'); // NEW key
                  return;
             }

             // Note: Storing plaintext password. Add hashing here for security.
             const passwordToSave = newPassword;

             try {
                 await dbPut('settings', { key: 'userPassword', value: passwordToSave });
                  showNotification(translateKey('alert_password_saved'), 'success'); // NEW key
                  domElements.passwordSettingsForm.reset(); // Clear input fields
                  await updatePasswordStatus(); // Update status display
             } catch (error) {
                 console.error("Error saving password:", error);
                  showNotification(translateKey('error_saving') + " (Password)", 'error');
             }
         }


        // --- Dashboard Functions ---

        async function updateDashboardStats() {
            try {
                const [sales, purchases, items] = await Promise.all([
                    dbGetAll('sales'),
                    dbGetAll('purchases'),
                    dbGetAll('items')
                ]);

                const todayStart = new Date();
                todayStart.setHours(0, 0, 0, 0);
                const todayEnd = new Date();
                todayEnd.setHours(23, 59, 59, 999);

                 // Filter sales by timestamp
                 const todaySales = sales.filter(sale => {
                     const saleTimestamp = new Date(sale.timestamp);
                     // Convert timestamps to UTC date strings for comparison if timezone is an issue
                     // Or compare Date objects directly if timestamps are stored as ISO strings (preferred)
                     return saleTimestamp >= todayStart && saleTimestamp <= todayEnd;
                 });

                 // Filter purchases by purchaseDate string (YYYY-MM-DD)
                 const todayPurchases = purchases.filter(purchase => {
                     // Convert purchaseDate string to a Date object representing the start of that day in UTC
                      try {
                          const [year, month, day] = purchase.purchaseDate.split('-').map(Number);
                          const purchaseDateUTC = new Date(Date.UTC(year, month - 1, day)); // Date object for start of day in UTC
                           // Check if the UTC date of the purchase falls within the UTC date range of today
                          return purchaseDateUTC >= new Date(Date.UTC(todayStart.getFullYear(), todayStart.getMonth(), todayStart.getDate())) &&
                                 purchaseDateUTC <= new Date(Date.UTC(todayEnd.getFullYear(), todayEnd.getMonth(), todayEnd.getDate(), 23, 59, 59, 999));
                      } catch { return false; } // Exclude if date format is invalid
                 });


                const totalTransactionsToday = todaySales.length;
                const salesRevenueToday = todaySales.reduce((sum, t) => sum + t.total, 0);
                const totalPurchasesToday = todayPurchases.reduce((sum, p) => sum + p.totalCost, 0);
                const netProfitToday = salesRevenueToday - totalPurchasesToday;
                 const lowStockItemsCount = items.filter(item => (Number(item.stock) || 0) < 10).length; // Count items with stock < 10

                 domElements.dbTotalTransactions.textContent = totalTransactionsToday;
                 domElements.dbSalesRevenue.textContent = formatCurrency(salesRevenueToday);
                 domElements.dbNetProfit.textContent = formatCurrency(netProfitToday);
                 domElements.dbLowStockItems.textContent = lowStockItemsCount; // Update new low stock element

            } catch (error) {
                console.error("Error updating dashboard stats:", error);
                 domElements.dbTotalTransactions.textContent = 'N/A';
                 domElements.dbSalesRevenue.textContent = 'N/A';
                 domElements.dbNetProfit.textContent = 'N/A';
                 domElements.dbLowStockItems.textContent = 'N/A'; // Update new low stock element
                 showNotification(translateKey("error_loading") + " (Dashboard)", 'error');
            }
        }

        // --- Point of Sale (POS) Functions ---

        function initTransaction() {
            currentTransaction = { items: [], total: 0, timestamp: null };
            updateTransactionUI();
            updateCompleteButtonState();
            console.log("New transaction initialized.");
        }

        async function loadPOSInterface() {
            try {
                 await renderCategoryTabs();
                 await updateProductsGrid();
                 if (!currentTransaction) {
                     initTransaction();
                 } else {
                     updateTransactionUI();
                 }
                 domElements.posSearchInput.value = '';
            } catch (error) {
                 console.error("Error loading POS interface:", error);
                 showNotification(translateKey("error_loading") + " (POS)", 'error');
             }
        }

        async function renderCategoryTabs() {
             try {
                 const categories = await dbGetAll('categories');
                 domElements.categoryTabs.innerHTML = `<div class="category-tab active" data-category-id="all" data-translate-key="pos_all_tab">${translateKey('pos_all_tab')}</div>`;
                 categories.sort((a, b) => a.name.localeCompare(b.name));
                 categories.forEach(category => {
                     const tab = document.createElement('div');
                     tab.className = 'category-tab';
                     tab.dataset.categoryId = category.id;
                     tab.textContent = category.name;
                     tab.onclick = () => filterProductsByCategory(category.id, tab);
                     domElements.categoryTabs.appendChild(tab);
                 });
             } catch (error) {
                 console.error("Error loading categories for tabs:", error);
                 showNotification(translateKey("error_loading") + " (Categories)", 'error');
             }
         }

          async function renderStockCategoryTabs() {
              try {
                  const categories = await dbGetAll('categories');
                  domElements.stockCategoryTabs.innerHTML = `<div class="category-tab active" data-category-id="all" data-translate-key="pos_all_tab">${translateKey('pos_all_tab')}</div>`;
                  categories.sort((a, b) => a.name.localeCompare(b.name));
                  categories.forEach(category => {
                      const tab = document.createElement('div');
                      tab.className = 'category-tab';
                      tab.dataset.categoryId = category.id;
                      tab.textContent = category.name;
                      tab.onclick = () => filterStockByCategory(category.id, tab);
                      domElements.stockCategoryTabs.appendChild(tab);
                  });
              } catch (error) {
                  console.error("Error loading categories for stock tabs:", error);
                  showNotification(translateKey("error_loading") + " (Stock Categories)", 'error');
              }
          }

         function filterProductsByCategory(categoryId, clickedTab) {
             domElements.categoryTabs.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
             clickedTab.classList.add('active');
             updateProductsGrid(categoryId, domElements.posSearchInput.value);
         }

          function filterStockByCategory(categoryId, clickedTab) {
              domElements.stockCategoryTabs.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
              clickedTab.classList.add('active');
              loadStockItems(categoryId);
          }

         async function updateProductsGrid(categoryId = 'all', searchQuery = '') {
             domElements.productGrid.innerHTML = '';
             const query = searchQuery.toLowerCase().trim();

             try {
                 let items = await dbGetAll('items');
                 let filteredItems = items;

                 if (categoryId !== 'all' && categoryId !== null) {
                     const catId = parseInt(categoryId);
                     filteredItems = items.filter(item => item.categoryId === catId);
                 }

                 if (query) {
                     filteredItems = filteredItems.filter(item =>
                         item.name && item.name.toLowerCase().includes(query)
                         // Barcode search removed
                     );
                 }

                 if (filteredItems.length === 0) {
                     domElements.productGrid.innerHTML = `<p>${translateKey('no_items_found')}</p>`;
                     return;
                 }

                 filteredItems.sort((a, b) => a.name.localeCompare(b.name)); // Sort by name

                 filteredItems.forEach(item => {
                     const card = document.createElement('div');
                     card.className = 'product-card';
                     const stockLevel = Number(item.stock) || 0;
                     card.innerHTML = `
                         <p>${item.name}</p>
                         <p>${formatCurrency(item.price)}</p>
                         <p>${translateKey('table_header_stock')}: ${stockLevel}</p>
                     `;
                     card.onclick = () => addItemToTransaction(item);
                      if (stockLevel <= 0) {
                         card.style.opacity = '0.6';
                         card.style.cursor = 'not-allowed';
                         card.title = translateKey('error_no_stock');
                      } else if (stockLevel < 10) { // Add visual cue for low stock on POS grid
                          card.style.border = '1px solid var(--danger-color)'; // Highlight low stock items
                      }
                     domElements.productGrid.appendChild(card);
                 });
             } catch (error) {
                 console.error("Error loading products:", error);
                 domElements.productGrid.innerHTML = `<p>${translateKey('error_loading')}</p>`;
                 showNotification(translateKey("error_loading") + " (Products)", 'error');
             }
         }

        async function addItemToTransaction(item) {
            // Prevent adding if stock is 0 or less
            if ((Number(item.stock) || 0) <= 0) {
                 showNotification(translateKey('error_no_stock'), 'error');
                 return;
             }

            if (!currentTransaction) initTransaction();

             try {
                 const currentItemState = await dbGet('items', item.id);
                 if (!currentItemState) {
                     showNotification(translateKey('error_item_not_found'), 'error');
                     // If item not found in DB, clean it from the current transaction if it somehow got there
                      const existingItemIndex = currentTransaction.items.findIndex(i => i.id === item.id);
                      if (existingItemIndex > -1) {
                          currentTransaction.items.splice(existingItemIndex, 1);
                           updateTransactionUI();
                           updateCompleteButtonState();
                      }
                     return;
                 }
                 const availableStock = Number(currentItemState.stock) || 0;
                 const existingItemIndex = currentTransaction.items.findIndex(i => i.id === item.id);

                 if (existingItemIndex > -1) {
                     const currentQuantityInCart = currentTransaction.items[existingItemIndex].quantity;
                     if (currentQuantityInCart >= availableStock) {
                         showNotification(translateKey('error_insufficient_stock', { name: item.name, available: availableStock }), 'error');
                         return;
                     }
                     currentTransaction.items[existingItemIndex].quantity += 1;
                 } else {
                     // Already checked availableStock > 0 at the start
                     currentTransaction.items.push({
                         id: item.id,
                         name: item.name,
                         price: item.price,
                         quantity: 1,
                     });
                 }
                 updateTransactionUI();
                 updateCompleteButtonState();
             } catch (error) {
                 console.error("Error adding item to transaction:", error);
                 showNotification(translateKey("error_loading") + " (Add Item)", 'error');
             }
         }

        function updateTransactionUI() {
            if (!currentTransaction) return;
            domElements.orderTableBody.innerHTML = '';
            currentTransaction.total = 0;

            if (currentTransaction.items.length === 0) {
                domElements.orderTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">${translateKey('pos_cart_empty')}</td></tr>`;
            } else {
                currentTransaction.items.forEach((item, index) => {
                    const totalItemPrice = item.price * item.quantity;
                    currentTransaction.total += totalItemPrice;

                    const row = document.createElement('tr');
                    // Use oninput instead of onchange for immediate update while typing
                    row.innerHTML = `
                        <td>${item.name}</td>
                        <td>
                            <input type="number" value="${item.quantity}" min="1" style="width: 60px; padding: 4px;" oninput="updateItemQuantity(${index}, this.value)">
                        </td>
                        <td>${formatCurrency(item.price)}</td>
                        <td>${formatCurrency(totalItemPrice)}</td>
                        <td class="action-buttons">
                             <button class="btn-danger btn-sm" onclick="removeItemFromTransaction(${index})" title="${translateKey('button_remove')}">×</button>
                        </td>
                    `; // Removed translate key from button text, using symbol
                    domElements.orderTableBody.appendChild(row);
                });
            }
            domElements.orderSubtotal.textContent = formatCurrency(currentTransaction.total);
        }

        async function updateItemQuantity(index, newQuantity) {
            const quantity = parseInt(newQuantity);
             const transactionItem = currentTransaction.items[index];

            if (!transactionItem) {
                 updateTransactionUI(); // Item somehow missing, refresh UI
                 updateCompleteButtonState();
                 return;
             }

            if (isNaN(quantity) || quantity < 0) {
                // If invalid quantity, revert to previous valid quantity or remove if 0
                if (quantity <= 0) {
                     removeItemFromTransaction(index); // Remove if quantity becomes 0 or less
                } else {
                     updateTransactionUI(); // Revert UI to last valid state
                }
                return;
            }

             if (quantity === 0) { // Explicitly handle quantity 0 for removal
                  removeItemFromTransaction(index);
                  return;
             }

             try {
                 const dbItem = await dbGet('items', transactionItem.id);
                 if (!dbItem) {
                     showNotification(translateKey('error_item_not_found'), 'error');
                     currentTransaction.items.splice(index, 1); // Remove if not found in DB
                     updateTransactionUI();
                     updateCompleteButtonState();
                     return;
                 }
                 const availableStock = Number(dbItem.stock) || 0;

                 if (quantity > availableStock) {
                     showNotification(translateKey('error_insufficient_stock', { name: transactionItem.name, available: availableStock }), 'error');
                     currentTransaction.items[index].quantity = availableStock; // Set to max available
                 } else {
                     currentTransaction.items[index].quantity = quantity;
                 }
                 updateTransactionUI();
                 updateCompleteButtonState();
             } catch (error) {
                 console.error("Error updating item quantity:", error);
                 showNotification(translateKey("error_loading") + " (Update Qty)", 'error');
                 updateTransactionUI(); // Revert UI on error
             }
         }

         function removeItemFromTransaction(index) {
             if (currentTransaction && currentTransaction.items[index]) {
                 currentTransaction.items.splice(index, 1);
                 updateTransactionUI();
                 updateCompleteButtonState();
             }
         }

        function updateCompleteButtonState() {
            const hasItems = currentTransaction && currentTransaction.items.length > 0;
            domElements.completeTransactionBtn.disabled = !hasItems;
            domElements.cancelTransactionBtn.disabled = !hasItems;
        }

        // Modified: Call confirmCompleteSale instead of executing directly
        function completeTransaction() {
             if (!currentTransaction || currentTransaction.items.length === 0) {
                 showNotification(translateKey('pos_cart_empty'), 'info');
                 return;
             }
             // Show confirmation modal
             showModal('confirm-sale-modal');
         }

         // New function to execute sale after confirmation
         async function executeCompleteSale() {
             if (!currentTransaction || currentTransaction.items.length === 0) return;

             closeModal('confirm-sale-modal'); // Close confirmation modal

             domElements.completeTransactionBtn.disabled = true;
             domElements.cancelTransactionBtn.disabled = true;

             try {
                 const itemUpdates = [];
                 for (const item of currentTransaction.items) {
                     const dbItem = await dbGet('items', item.id);
                     if (!dbItem) throw new Error(translateKey('error_item_not_found') + `: ${item.name}`);
                      const availableStock = Number(dbItem.stock) || 0;
                     if (availableStock < item.quantity) {
                          // This check should ideally happen in updateItemQuantity, but as a fallback
                          throw new Error(translateKey('error_insufficient_stock', { name: item.name, available: availableStock }));
                     }
                      const updatedItem = { ...dbItem, stock: availableStock - item.quantity };
                      itemUpdates.push(updatedItem);
                 }

                  const tx = db.transaction(['items', 'sales'], 'readwrite');
                  const itemsStore = tx.objectStore('items');
                  const salesStore = tx.objectStore('sales');
                  // No need for Promises array here, just queue the requests
                  itemUpdates.forEach(updatedItem => itemsStore.put(updatedItem));

                  const saleData = {
                      items: currentTransaction.items,
                      total: currentTransaction.total,
                      timestamp: new Date().toISOString() // Store as ISO string for consistent sorting/comparison
                  };
                  salesStore.add(saleData);

                  // Wait for transaction to complete
                  await new Promise((resolve, reject) => {
                      tx.oncomplete = resolve;
                      tx.onerror = (e) => reject(tx.error || new Error(`Sale transaction failed: ${e.target?.error?.message || 'Unknown Error'}`));
                      tx.onabort = (e) => reject(tx.error || new Error(`Sale transaction aborted: ${e.target?.error?.message || 'Aborted'}`));
                  });


                 showNotification(translateKey('alert_sale_complete'), 'success');
                 initTransaction(); // Start a new transaction
                 await updateDashboardStats(); // Refresh dashboard
                 await updateProductsGrid(); // Refresh POS product grid (stock levels change)

            } catch (error) {
                console.error("Error executing transaction:", error);
                 const errorMessage = error instanceof Error ? error.message : error.target?.error?.message || 'Unknown Error'; // Get specific error message
                 showNotification(translateKey('error_saving') + ` (Sale: ${errorMessage})`, 'error');
                 updateCompleteButtonState(); // Re-enable buttons on failure
            }
         }


        function cancelTransaction() {
            if (currentTransaction && currentTransaction.items.length > 0) {
                 if (confirm(translateKey('confirm_cancel_sale'))) {
                     initTransaction();
                 }
            } else {
                 initTransaction(); // Simply reset if already empty
             }
        }


        // --- Item Management ---

        async function openItemModal(item = null) {
            domElements.itemForm.reset();
            domElements.itemModalTitle.setAttribute('data-translate-key', item ? 'form_edit_item' : 'form_add_item');
            updateElementText(domElements.itemModalTitle, item ? 'form_edit_item' : 'form_add_item');

            domElements.itemIdInput.value = item ? item.id : '';
            domElements.itemNameInput.value = item ? item.name : '';
            domElements.itemPriceInput.value = item ? item.price : '';
            // Barcode input removed

            domElements.itemStockField.style.display = item ? 'none' : 'block';
            domElements.itemStockInput.required = !item;
            if (!item) domElements.itemStockInput.value = '0'; // Default stock for new item

            try {
                 await loadCategoriesIntoSelect(domElements.itemCategorySelect, item ? item.categoryId : null);
                 showModal('item-modal');
             } catch (error) {
                 console.error("Error opening item modal:", error);
                 showNotification(translateKey("error_loading") + " (Item Modal)", 'error');
             }
         }

        async function loadCategoriesIntoSelect(selectElement, selectedId = null) {
            selectElement.innerHTML = ''; // Clear existing options
            try {
                const categories = await dbGetAll('categories');
                if (categories.length === 0) {
                    selectElement.innerHTML = `<option value="" disabled selected>${translateKey('no_categories_found')}</option>`;
                    selectElement.disabled = true;
                } else {
                     selectElement.disabled = false;
                     let optionsHTML = `<option value="" disabled ${selectedId === null ? 'selected' : ''}>${translateKey('select_category_placeholder')}</option>`;
                     categories.sort((a, b) => a.name.localeCompare(b.name));
                     categories.forEach(category => {
                         optionsHTML += `<option value="${category.id}" ${selectedId !== null && category.id === selectedId ? 'selected' : ''}>${category.name}</option>`;
                     });
                     selectElement.innerHTML = optionsHTML;
                 }
            } catch (error) {
                console.error("Error loading categories into select:", error);
                 selectElement.innerHTML = `<option value="" disabled selected>${translateKey('error_loading')}</option>`;
                 selectElement.disabled = true;
            }
        }

        async function saveItem(event) {
            event.preventDefault();

            const id = domElements.itemIdInput.value ? parseInt(domElements.itemIdInput.value) : null;
            const name = domElements.itemNameInput.value.trim();
            const categoryId = parseInt(domElements.itemCategorySelect.value);
            const price = parseFloat(domElements.itemPriceInput.value);
             // Barcode removed

            if (!name || isNaN(categoryId) || !categoryId || isNaN(price) || price < 0) { // Check categoryId is a valid number
                showNotification(translateKey('error_invalid_input'), 'error');
                return;
            }

             const itemData = { name, categoryId, price }; // Base data

             try {
                 let operation;
                 if (id) { // Editing
                     const existing = await dbGet('items', id);
                     if (!existing) {
                          showNotification(translateKey('error_item_not_found'), 'error'); return;
                      }
                     itemData.id = id;
                     itemData.stock = existing.stock; // Preserve existing stock
                     operation = dbPut('items', itemData);
                 } else { // Adding
                     const stock = parseInt(domElements.itemStockInput.value);
                     if (isNaN(stock) || stock < 0) {
                         showNotification(translateKey('error_invalid_input') + " (Stock)", 'error'); return;
                     }
                     itemData.stock = stock;
                     operation = dbAdd('items', itemData);
                 }

                 await operation;
                 closeModal('item-modal');
                 showNotification(translateKey('alert_success_save'), 'success');
                 // Refresh relevant tables/views
                 await loadItems();
                 if (document.getElementById('pos-section').classList.contains('active')) await updateProductsGrid();
                 if (document.getElementById('stock-section').classList.contains('active') && passwordVerified) await loadStockItems();
                 await updateDashboardStats(); // Stock count or low stock might change

             } catch (error) {
                 console.error("Error saving item:", error);
                 showNotification(error.message || translateKey('error_saving'), 'error');
             }
         }

        // Modified: Prioritize low stock items and color them red
        async function loadItems(searchQuery = domElements.itemSearchInput.value || '') {
            domElements.itemsTableBody.innerHTML = '';
            const query = searchQuery.toLowerCase().trim();

            try {
                const [items, categories] = await Promise.all([ dbGetAll('items'), dbGetAll('categories') ]);
                const categoryMap = categories.reduce((map, cat) => { map[cat.id] = cat.name; return map; }, {});

                let filteredItems = items;
                if (query) {
                    filteredItems = items.filter(item =>
                        item.name && item.name.toLowerCase().includes(query)
                        // Barcode search removed
                    );
                }

                if (filteredItems.length === 0) {
                    domElements.itemsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">${translateKey('no_items_found')}</td></tr>`;
                    return;
                }

                 // Separate items into low stock (< 10) and others
                 const lowStockItems = filteredItems.filter(item => (Number(item.stock) || 0) < 10);
                 const otherItems = filteredItems.filter(item => (Number(item.stock) || 0) >= 10);

                 // Sort both lists by name
                 lowStockItems.sort((a, b) => a.name.localeCompare(b.name));
                 otherItems.sort((a, b) => a.name.localeCompare(b.name));

                 // Combine with low stock items first
                 const sortedItems = [...lowStockItems, ...otherItems];

                 let rowsHTML = '';
                 sortedItems.forEach(item => {
                      const stockLevel = Number(item.stock) || 0;
                      // Determine text color based on stock level
                      const nameColorStyle = stockLevel < 10 ? `style="color: var(--danger-color);"` : '';
                      // Escape quotes in name for onclick parameter
                      const escapedName = item.name.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                      rowsHTML += `
                          <tr>
                              <td ${nameColorStyle}>${item.name}</td>
                              <td>${categoryMap[item.categoryId] || translateKey('unknown_category')}</td>
                              <td>${formatCurrency(item.price)}</td>
                              <td>${stockLevel}</td>
                              <td class="action-buttons">
                                  <button class="btn-primary btn-sm" onclick='openItemModal(${JSON.stringify(item)})'>${translateKey('button_edit')}</button>
                                  <button class="btn-danger btn-sm" onclick="confirmDelete('item', ${item.id}, '${escapedName}')">${translateKey('button_delete')}</button>
                              </td>
                          </tr>
                      `;
                 });
                 domElements.itemsTableBody.innerHTML = rowsHTML;
            } catch (error) {
                console.error("Error loading items:", error);
                domElements.itemsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">${translateKey('error_loading')}</td></tr>`;
            }
        }


        // --- Category Management ---

        function openCategoryModal(category = null) {
            domElements.categoryForm.reset();
            domElements.categoryModalTitle.setAttribute('data-translate-key', category ? 'form_edit_category' : 'form_add_category');
            updateElementText(domElements.categoryModalTitle, category ? 'form_edit_category' : 'form_add_category');
            domElements.categoryIdInput.value = category ? category.id : '';
            domElements.categoryNameInput.value = category ? category.name : '';
            showModal('category-modal');
        }

        async function saveCategory(event) {
            event.preventDefault();
            const id = domElements.categoryIdInput.value ? parseInt(domElements.categoryIdInput.value) : null;
            const name = domElements.categoryNameInput.value.trim();

            if (!name) {
                showNotification(translateKey('error_invalid_input'), 'error'); return;
            }

             try {
                 const categories = await dbGetAll('categories');
                 // Check for duplicate name (case-insensitive, excluding the current category if editing)
                 const existingCategory = categories.find(cat => cat.name.toLowerCase() === name.toLowerCase() && cat.id !== id);
                 if (existingCategory) {
                      showNotification(translateKey('error_category_name_exists'), 'error'); return;
                  }

                 const categoryData = { name };
                 if (id) categoryData.id = id;
                 await (id ? dbPut('categories', categoryData) : dbAdd('categories', categoryData));

                 closeModal('category-modal');
                 showNotification(translateKey('alert_success_save'), 'success');
                 // Refresh relevant tables/views
                 await loadCategories();
                 await renderCategoryTabs(); // For POS
                 await renderStockCategoryTabs(); // For Stock section
                 await loadCategoriesIntoSelect(domElements.itemCategorySelect); // For Item modal

             } catch (error) {
                 console.error("Error saving category:", error);
                 showNotification(translateKey('error_saving') + " (Category)", 'error');
             }
         }

        async function loadCategories() {
            domElements.categoriesTableBody.innerHTML = '';
            try {
                const categories = await dbGetAll('categories');
                if (categories.length === 0) {
                    domElements.categoriesTableBody.innerHTML = `<tr><td colspan="2" style="text-align: center;">${translateKey('no_categories_found')}</td></tr>`;
                    return;
                }
                 categories.sort((a, b) => a.name.localeCompare(b.name));
                 let rowsHTML = '';
                 categories.forEach(category => {
                     const escapedName = category.name.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                     rowsHTML += `
                        <tr>
                            <td class="item-name-clickable" onclick="showCategoryItems(${category.id}, '${escapedName}')">${category.name}</td>
                            <td class="action-buttons">
                                <button class="btn-primary btn-sm" onclick='openCategoryModal(${JSON.stringify(category)})'>${translateKey('button_edit')}</button>
                                <button class="btn-danger btn-sm" onclick="confirmDelete('category', ${category.id}, '${escapedName}')">${translateKey('button_delete')}</button>
                            </td>
                        </tr>`;
                 });
                 domElements.categoriesTableBody.innerHTML = rowsHTML;
            } catch (error) {
                console.error("Error loading categories:", error);
                domElements.categoriesTableBody.innerHTML = `<tr><td colspan="2" style="text-align: center;">${translateKey('error_loading')}</td></tr>`;
            }
        }

        async function showCategoryItems(categoryId, categoryName) {
            domElements.categoryItemsTableBody.innerHTML = '';
            domElements.categoryItemsTitleSpan.textContent = categoryName;
            domElements.categoryItemsDisplay.style.display = 'block';

            try {
                const items = await dbGetAllByIndex('items', 'categoryId', categoryId);
                if (items.length === 0) {
                    domElements.categoryItemsTableBody.innerHTML = `<tr><td colspan="3" style="text-align: center;">${translateKey('no_items_found')}</td></tr>`;
                    return;
                }
                 items.sort((a, b) => a.name.localeCompare(b.name));
                 let rowsHTML = '';
                 items.forEach(item => {
                      const stockLevel = Number(item.stock) || 0;
                       // Determine text color based on stock level for category items view too
                      const nameColorStyle = stockLevel < 10 ? `style="color: var(--danger-color);"` : '';
                      rowsHTML += `
                          <tr>
                              <td ${nameColorStyle}>${item.name}</td>
                              <td>${formatCurrency(item.price)}</td>
                              <td>${stockLevel}</td>
                          </tr>`;
                 });
                 domElements.categoryItemsTableBody.innerHTML = rowsHTML;
            } catch (error) {
                console.error("Error loading category items:", error);
                domElements.categoryItemsTableBody.innerHTML = `<tr><td colspan="3" style="text-align: center;">${translateKey('error_loading')}</td></tr>`;
            }
        }


        // --- Stock Management ---

        async function loadStockItems(categoryId = 'all') {
            // Only load if password has been verified in this session
            if (!passwordVerified) {
                 domElements.stockTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">${translateKey('password_prompt_title')}</td></tr>`;
                 return;
            }

            domElements.stockTableBody.innerHTML = '';
            try {
                let items = await dbGetAll('items');
                let filteredItems = items;
                if (categoryId !== 'all' && categoryId !== null) {
                    const catId = parseInt(categoryId);
                    filteredItems = items.filter(item => item.categoryId === catId);
                }

                if (filteredItems.length === 0) {
                    domElements.stockTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">${translateKey('no_items_found')}</td></tr>`;
                    return;
                }

                 filteredItems.sort((a, b) => a.name.localeCompare(b.name));
                 let rowsHTML = '';
                 filteredItems.forEach(item => {
                      const stockLevel = Number(item.stock) || 0;
                      const inputId = `stock-add-${item.id}`;
                       // Determine text color based on stock level for stock table too
                      const nameColorStyle = stockLevel < 10 ? `style="color: var(--danger-color);"` : '';
                      rowsHTML += `
                          <tr>
                              <td ${nameColorStyle}>${item.name}</td>
                              <td>${stockLevel}</td>
                              <td><input type="number" id="${inputId}" min="0" step="1" value="0" style="width: 80px; padding: 4px;"></td>
                              <td class="action-buttons">
                                  <button class="btn-primary btn-sm" onclick="addStock(${item.id}, '${inputId}')">${translateKey('form_save')}</button>
                              </td>
                          </tr>`;
                 });
                 domElements.stockTableBody.innerHTML = rowsHTML;
            } catch (error) {
                console.error("Error loading stock items:", error);
                domElements.stockTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">${translateKey('error_loading')}</td></tr>`;
            }
        }


        async function addStock(itemId, inputId) {
            const inputElement = document.getElementById(inputId);
            if (!inputElement) return;
            const quantityToAdd = parseInt(inputElement.value);

            if (isNaN(quantityToAdd) || quantityToAdd < 0) {
                 showNotification(translateKey('error_invalid_input') + " (Stock Quantity)", 'error'); return;
             }
             if (quantityToAdd === 0) return; // No change

            try {
                const item = await dbGet('items', itemId);
                if (!item) { showNotification(translateKey('error_item_not_found'), 'error'); return; }

                 const currentStock = Number(item.stock) || 0;
                 item.stock = currentStock + quantityToAdd;
                 await dbPut('items', item);

                 showNotification(translateKey('alert_stock_added'), 'success');
                 inputElement.value = '0';
                 // Refresh relevant views
                 const activeStockCatId = domElements.stockCategoryTabs.querySelector('.category-tab.active')?.dataset.categoryId || 'all';
                 await loadStockItems(activeStockCatId);
                 if (document.getElementById('pos-section').classList.contains('active')) {
                     const activePOSCatId = domElements.categoryTabs.querySelector('.category-tab.active')?.dataset.categoryId || 'all';
                     await updateProductsGrid(activePOSCatId, domElements.posSearchInput.value);
                 }
                 await updateDashboardStats(); // Stock count or low stock might change

             } catch (error) {
                 console.error("Error updating stock:", error);
                 showNotification(translateKey('error_updating') + " (Stock)", 'error');
             }
         }

        // --- Purchase Management ---

        function openPurchaseModal(purchase = null) {
            domElements.purchaseForm.reset();
            domElements.purchaseModalTitle.setAttribute('data-translate-key', purchase ? 'form_edit_purchase' : 'form_add_purchase');
            updateElementText(domElements.purchaseModalTitle, purchase ? 'form_edit_purchase' : 'form_add_purchase');

            domElements.purchaseIdInput.value = purchase ? purchase.id : '';
            domElements.purchaseItemNameInput.value = purchase ? purchase.itemName : '';
            domElements.purchaseQuantityInput.value = purchase ? purchase.quantity : '';
            domElements.purchaseTotalCostInput.value = purchase ? purchase.totalCost : '';
            domElements.purchaseDateInput.value = purchase ? purchase.purchaseDate : new Date().toISOString().split('T')[0];

            showModal('purchase-modal');
        }

        async function savePurchase(event) {
            event.preventDefault();
            const id = domElements.purchaseIdInput.value ? parseInt(domElements.purchaseIdInput.value) : null;
            const itemName = domElements.purchaseItemNameInput.value.trim();
            const quantity = parseInt(domElements.purchaseQuantityInput.value);
            const totalCost = parseFloat(domElements.purchaseTotalCostInput.value);
            const purchaseDate = domElements.purchaseDateInput.value; // YYYY-MM-DD string

            if (!itemName || isNaN(quantity) || quantity < 1 || isNaN(totalCost) || totalCost < 0 || !purchaseDate) {
                showNotification(translateKey('error_invalid_input'), 'error'); return;
            }

             // Store timestamp of creation/update for general record keeping, but filter by purchaseDate string for reports
             const purchaseData = { itemName, quantity, totalCost, purchaseDate, timestamp: new Date().toISOString() };
             if (id) purchaseData.id = id;

             try {
                 await (id ? dbPut('purchases', purchaseData) : dbAdd('purchases', purchaseData));
                 closeModal('purchase-modal');
                 showNotification(translateKey('alert_success_save'), 'success');
                 await loadPurchases();
                 await updateDashboardStats(); // Dashboard profit might change

             } catch (error) {
                 console.error("Error saving purchase:", error);
                 showNotification(translateKey('error_saving') + " (Purchase)", 'error');
             }
         }


        async function loadPurchases() {
            domElements.purchasesTableBody.innerHTML = '';
            try {
                const purchases = await dbGetAll('purchases');
                if (purchases.length === 0) {
                    domElements.purchasesTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">${translateKey('no_purchases_found')}</td></tr>`;
                    return;
                }
                 // Sort by purchaseDate string (descending)
                 purchases.sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate));
                 let rowsHTML = '';
                 purchases.forEach(purchase => {
                     const escapedName = purchase.itemName.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                     rowsHTML += `
                         <tr>
                             <td>${purchase.itemName}</td>
                             <td>${purchase.quantity}</td>
                             <td>${formatCurrency(purchase.totalCost)}</td>
                             <td>${formatDate(purchase.purchaseDate)}</td>
                             <td class="action-buttons">
                                 <button class="btn-primary btn-sm" onclick='openPurchaseModal(${JSON.stringify(purchase)})'>${translateKey('button_edit')}</button>
                                 <button class="btn-danger btn-sm" onclick="confirmDelete('purchase', ${purchase.id}, '${escapedName}')">${translateKey('button_delete')}</button>
                             </td>
                         </tr>`;
                 });
                 domElements.purchasesTableBody.innerHTML = rowsHTML;
            } catch (error) {
                console.error("Error loading purchases:", error);
                domElements.purchasesTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">${translateKey('error_loading')}</td></tr>`;
            }
        }

        // --- Delete Confirmation & Execution ---

        function confirmDelete(type, id, name) {
            deleteTarget = { type, id };
            const messageKey = `confirm_delete_${type}_message`;
            const message = translateKey(messageKey, { name: name });
            domElements.confirmDeleteMsg.textContent = message;
            showModal('confirm-delete-modal');
        }

        async function executeDelete() {
            if (!deleteTarget) return;
            const { type, id } = deleteTarget;
            closeModal('confirm-delete-modal');

            try {
                 // Start transaction with all relevant stores
                 const storeNames = ['items', 'categories', 'purchases'];
                 const tx = db.transaction(storeNames, 'readwrite');
                 const stores = storeNames.reduce((acc, name) => { acc[name] = tx.objectStore(name); return acc; }, {});

                 if (type === 'category') {
                     // Find and delete associated items within the same transaction
                     const itemsIndex = stores.items.index('categoryId');
                     const itemsReq = itemsIndex.getAll(IDBKeyRange.only(id));

                     itemsReq.onsuccess = () => {
                         const itemsToDelete = itemsReq.result;
                         itemsToDelete.forEach(item => {
                             stores.items.delete(item.id); // Queue item deletion
                         });
                         stores.categories.delete(id); // Queue category deletion
                     };
                     itemsReq.onerror = (e) => {
                         // Abort transaction on error finding items
                          console.error("Error finding items for category deletion:", e.target.error);
                         tx.abort(); // This will trigger tx.onabort
                      }

                 } else if (type === 'item') {
                     stores.items.delete(id); // Queue item deletion
                 } else if (type === 'purchase') {
                     stores.purchases.delete(id); // Queue purchase deletion
                 }

                  // Wait for the transaction to complete or error out
                  await new Promise((resolve, reject) => {
                      tx.oncomplete = resolve;
                      tx.onerror = (e) => reject(tx.error || new Error(`Deletion failed for ${type} ID ${id}`));
                      tx.onabort = (e) => reject(tx.error || new Error(`Deletion aborted for ${type} ID ${id}`));
                  });

                 showNotification(translateKey('alert_success_delete'), 'success');

                 // Refresh relevant UI sections AFTER successful transaction
                 if (type === 'category') {
                      await loadCategories();
                      await loadItems(); // Items table needs full reload as items might be gone
                      await renderCategoryTabs(); // For POS categories
                      await renderStockCategoryTabs(); // For Stock categories
                      await loadCategoriesIntoSelect(domElements.itemCategorySelect); // For Item modal
                      if (domElements.categoryItemsDisplay.style.display === 'block') domElements.categoryItemsDisplay.style.display = 'none'; // Hide category items view
                      if (document.getElementById('pos-section').classList.contains('active')) await updateProductsGrid(); // Update POS grid
                       // Stock section refresh handled by navigate or loadSectionData
                  } else if (type === 'item') {
                      await loadItems(); // Reload items table
                      if (document.getElementById('pos-section').classList.contains('active')) await updateProductsGrid(); // Update POS grid
                       // Stock section refresh handled by navigate or loadSectionData
                      if (document.getElementById('categories-section').classList.contains('active') && domElements.categoryItemsDisplay.style.display === 'block') {
                           // If category items view is open and the deleted item was in the displayed category, refresh it
                           const currentCategoryId = domElements.categoryItemsTitleSpan.dataset.categoryId; // Need to store categoryId
                           const categoryElement = document.querySelector(`#categories-table-body tr td.item-name-clickable[onclick*="showCategoryItems(${currentCategoryId},"]`);
                           if (categoryElement) categoryElement.click(); // Re-trigger showing items
                       }
                      if (currentTransaction) { // Remove from current order if deleted
                          const itemIndex = currentTransaction.items.findIndex(i => i.id === id);
                          if (itemIndex > -1) removeItemFromTransaction(itemIndex);
                      }
                  } else if (type === 'purchase') {
                      await loadPurchases(); // Reload purchases table
                  }
                 await updateDashboardStats(); // Always update dashboard as stats might change

            } catch (error) {
                console.error(`Error deleting ${type}:`, error);
                showNotification(translateKey('error_deleting') + ` (${error.message || 'Unknown Error'})`, 'error');
            } finally {
                deleteTarget = null; // Reset delete target
            }
        }

        // --- Report Generation ---

        async function generateReport(type, dateValue) {
             if (!passwordVerified) return; // Only generate if password was verified

             domElements.reportSalesTableBody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
             domElements.reportPurchasesTableBody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
             domElements.reportInventoryTableBody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
             domElements.reportTotalSales.textContent = '...';
             domElements.reportTotalPurchases.textContent = '...';
             domElements.reportNetProfit.textContent = '...';
             showModal('report-modal');

             let startDate, endDate;
             let reportTitleKey = type === 'daily' ? 'daily_report_title' : 'monthly_report_title';
             updateElementText(domElements.reportModalTitle, reportTitleKey);

             try {
                 if (type === 'daily') {
                     const [year, month, day] = dateValue.split('-').map(Number);
                     // Create date range in UTC to match how timestamps are likely stored/compared
                     startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
                     endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
                 } else { // monthly
                     const [year, month] = dateValue.split('-').map(Number);
                     // Create date range in UTC
                     startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
                     endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)); // Last day of month in UTC
                 }

                 const [allSales, allPurchases, allItems, allCategories] = await Promise.all([
                     dbGetAll('sales'), dbGetAll('purchases'), dbGetAll('items'), dbGetAll('categories')
                 ]);
                 const categoryMap = allCategories.reduce((map, cat) => { map[cat.id] = cat.name; return map; }, {});

                 // Filter sales by timestamp
                 const filteredSales = allSales.filter(sale => {
                     const saleDate = new Date(sale.timestamp); // Assuming timestamp is ISO string
                     return saleDate >= startDate && saleDate <= endDate;
                 });

                 // Filter purchases by purchaseDate string (YYYY-MM-DD)
                 const filteredPurchases = allPurchases.filter(purchase => {
                      try {
                          const [pYear, pMonth, pDay] = purchase.purchaseDate.split('-').map(Number);
                          // Create Date object for the start of the purchase day in UTC for comparison
                          const purchaseDateUTC = new Date(Date.UTC(pYear, pMonth - 1, pDay));
                           // Compare against the UTC date range of the report period
                          return purchaseDateUTC >= new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) &&
                                 purchaseDateUTC <= new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())); // Compare day only for purchaseDate string
                      } catch { return false; } // Exclude if date format is invalid
                  });

                 // --- Populate Tables ---
                 // Sales Table
                 let salesRowsHTML = '';
                 if (filteredSales.length === 0) {
                     salesRowsHTML = `<tr><td colspan="3" style="text-align: center;">${translateKey('no_sales_found')}</td></tr>`;
                 } else {
                      // Sort by timestamp (ascending)
                      filteredSales.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                      filteredSales.forEach(sale => {
                          // Format timestamp for display, assuming it's an ISO string
                          const itemsList = sale.items.map(item => `${item.name} (${item.quantity})`).join(', ');
                          salesRowsHTML += `
                              <tr>
                                  <td>${formatDate(sale.timestamp)}</td>
                                  <td>${itemsList}</td>
                                  <td>${formatCurrency(sale.total)}</td>
                              </tr>`;
                      });
                 }
                 domElements.reportSalesTableBody.innerHTML = salesRowsHTML;

                 // Purchases Table
                 let purchasesRowsHTML = '';
                 if (filteredPurchases.length === 0) {
                     purchasesRowsHTML = `<tr><td colspan="4" style="text-align: center;">${translateKey('no_purchases_found')}</td></tr>`;
                 } else {
                     // Sort by purchaseDate (ascending string comparison works for YYYY-MM-DD)
                     filteredPurchases.sort((a, b) => a.purchaseDate.localeCompare(b.purchaseDate));
                     filteredPurchases.forEach(purchase => {
                         purchasesRowsHTML += `
                             <tr>
                                 <td>${formatDate(purchase.purchaseDate)}</td>
                                 <td>${purchase.itemName}</td>
                                 <td>${purchase.quantity}</td>
                                 <td>${formatCurrency(purchase.totalCost)}</td>
                             </tr>`;
                     });
                 }
                  domElements.reportPurchasesTableBody.innerHTML = purchasesRowsHTML;

                 // Inventory Table (Current Status - Not filtered by date period)
                 let inventoryRowsHTML = '';
                 if (allItems.length === 0) {
                     inventoryRowsHTML = `<tr><td colspan="3" style="text-align: center;">${translateKey('no_items_found')}</td></tr>`;
                 } else {
                      allItems.sort((a, b) => a.name.localeCompare(b.name)); // Sort by name
                      allItems.forEach(item => {
                          const stockLevel = Number(item.stock) || 0;
                           // Determine text color based on stock level for report inventory view
                          const nameColorStyle = stockLevel < 10 ? `style="color: var(--danger-color);"` : '';
                          inventoryRowsHTML += `
                              <tr>
                                  <td ${nameColorStyle}>${item.name}</td>
                                  <td>${categoryMap[item.categoryId] || translateKey('unknown_category')}</td>
                                  <td>${stockLevel}</td>
                              </tr>`;
                      });
                  }
                 domElements.reportInventoryTableBody.innerHTML = inventoryRowsHTML;

                 // --- Calculate and Display Summary ---
                 const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
                 const totalPurchases = filteredPurchases.reduce((sum, purchase) => sum + purchase.totalCost, 0);
                 const netProfit = totalSales - totalPurchases;

                 domElements.reportTotalSales.textContent = formatCurrency(totalSales);
                 domElements.reportTotalPurchases.textContent = formatCurrency(totalPurchases);
                 domElements.reportNetProfit.textContent = formatCurrency(netProfit);

             } catch (error) {
                 console.error("Error generating report:", error);
                 showNotification(translateKey('error_generating_report'), 'error');
                 // Display error in tables
                 domElements.reportSalesTableBody.innerHTML = `<tr><td colspan="3" style="color:red; text-align:center;">${translateKey('error_generating_report')}</td></tr>`;
                 domElements.reportPurchasesTableBody.innerHTML = `<tr><td colspan="4" style="color:red; text-align:center;">${translateKey('error_generating_report')}</td></tr>`;
                 domElements.reportInventoryTableBody.innerHTML = `<tr><td colspan="3" style="color:red; text-align:center;">${translateKey('error_generating_report')}</td></tr>`;
                 // Clear summary stats on error
                  domElements.reportTotalSales.textContent = formatCurrency(0);
                  domElements.reportTotalPurchases.textContent = formatCurrency(0);
                  domElements.reportNetProfit.textContent = formatCurrency(0);
             }
         }


        // --- Export Functions ---

        function exportReportToPDF() {
            if (typeof jspdf === 'undefined' || typeof jspdf.plugin.autotable === 'undefined') {
                console.error("jsPDF or jsPDF-AutoTable is not loaded!");
                showNotification("PDF export library not loaded.", 'error'); return;
            }
             const { jsPDF } = window.jspdf;
             const doc = new jsPDF();
             const title = domElements.reportModalTitle.textContent;
             const timestamp = new Date().toISOString().split('T')[0];
             let finalY = 22; // Start Y position lower

             doc.setFontSize(16);
             doc.text(title, 14, finalY);
             finalY += 10;

             const addTableToPdf = (tableSelector, sectionTitleKey, emptyMessageKey) => {
                 doc.setFontSize(12);
                 doc.text(translateKey(sectionTitleKey), 14, finalY);
                 finalY += 7;
                 const table = document.querySelector(tableSelector);
                 // Check if table has actual data rows (not just the "No data found" row)
                 if (table && table.querySelector('tbody tr') && !table.querySelector('tbody td[colspan]')) {
                      // Clone table to remove inline styles that interfere with autoTable parsing colors
                      const clonedTable = table.cloneNode(true);
                      // Remove danger color style from cloned table for PDF (optional, depends on desired look)
                      clonedTable.querySelectorAll('td[style*="color: var(--danger-color)"]').forEach(td => {
                          td.style.color = ''; // Remove inline color style
                          // Or change to a fixed color if needed for PDF
                          // td.style.color = '#dc3545';
                      });

                     doc.autoTable({
                         html: clonedTable, // Use cloned table
                         startY: finalY,
                         theme: 'grid',
                         headStyles: { fillColor: [74, 71, 228], textColor: [255, 255, 255] }, // Use theme color
                         styles: { fontSize: 8, cellPadding: 2, textColor: [0, 0, 0] }, // Default text color
                         didDrawPage: (data) => { finalY = data.cursor.y; }
                     });
                 } else {
                     doc.setFontSize(9);
                     doc.text(translateKey(emptyMessageKey), 14, finalY);
                     finalY += 7;
                 }
                 finalY += 10; // Margin after table/message
             };

             addTableToPdf('#report-sales-table', 'report_sales_section', 'no_sales_found');
             addTableToPdf('#report-purchases-table', 'report_purchases_section', 'no_purchases_found');
             addTableToPdf('#report-inventory-table', 'report_inventory_section', 'no_items_found');

             // Add Summary
             doc.setFontSize(12);
             doc.text(translateKey('report_summary_section'), 14, finalY);
             finalY += 8;
             doc.setFontSize(10);
             doc.text(`${translateKey('report_total_sales')}: ${domElements.reportTotalSales.textContent}`, 14, finalY); finalY += 7;
             doc.text(`${translateKey('report_total_purchases')}: ${domElements.reportTotalPurchases.textContent}`, 14, finalY); finalY += 7;
             doc.text(`${translateKey('dashboard_net_profit')}: ${domElements.reportNetProfit.textContent}`, 14, finalY);

             doc.save(`Report_${title.replace(/\s+/g, '_')}_${timestamp}.pdf`);
         }


        function exportReportToCSV() {
            let csv = '';
            const timestamp = new Date().toISOString().split('T')[0];
            const title = domElements.reportModalTitle.textContent.replace(/\s+/g, '_');
            const escapeCSV = (field) => `"${String(field ?? '').replace(/"/g, '""')}"`; // Simplified escape

            const addTableToCsv = (tableSelector, sectionTitleKey, emptyMessageKey) => {
                csv += `\n"${translateKey(sectionTitleKey)}"\n`;
                const table = document.querySelector(tableSelector);
                if (!table) return;
                const headers = Array.from(table.querySelectorAll('thead th')).map(th => escapeCSV(th.textContent));
                csv += headers.join(',') + '\n';
                const rows = table.querySelectorAll('tbody tr');
                 // Check if table has actual data rows (not just the "No data found" row)
                 if (rows.length === 1 && rows[0].querySelector('td[colspan]')) {
                     csv += `"${translateKey(emptyMessageKey)}"\n`; // Add empty message if only colspan row exists
                 } else {
                     rows.forEach(row => {
                         const cols = Array.from(row.querySelectorAll('td')).map(td => {
                             // Remove inline styles for CSV export
                             let text = td.textContent;
                             // Add any other cleaning for CSV if needed
                             return escapeCSV(text);
                         });
                         // Ensure the number of columns matches the header count before joining
                         if(cols.length === headers.length) csv += cols.join(',') + '\n';
                         // Optional: Log warning if column count mismatch
                         // else console.warn("CSV column count mismatch in table", tableSelector, "Row:", row.textContent);
                     });
                 }
            };

            addTableToCsv('#report-sales-table', 'report_sales_section', 'no_sales_found');
            addTableToCsv('#report-purchases-table', 'report_purchases_section', 'no_purchases_found');
            addTableToCsv('#report-inventory-table', 'report_inventory_section', 'no_items_found');

            // Summary Data
             csv += `\n"${translateKey('report_summary_section')}"\n`;
             csv += `${escapeCSV(translateKey('report_total_sales'))},${escapeCSV(domElements.reportTotalSales.textContent)}\n`;
             csv += `${escapeCSV(translateKey('report_total_purchases'))},${escapeCSV(domElements.reportTotalPurchases.textContent)}\n`;
             csv += `${escapeCSV(translateKey('dashboard_net_profit'))},${escapeCSV(domElements.reportNetProfit.textContent)}\n`;

            // Trigger download
             const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
             const link = document.createElement('a');
             link.href = URL.createObjectURL(blob);
             link.download = `Report_${title}_${timestamp}.csv`;
             document.body.appendChild(link); link.click(); document.body.removeChild(link);
             URL.revokeObjectURL(link.href);
         }

         // --- Settings Functions ---

         function confirmClearAllData() {
             showModal('confirm-clear-all-modal');
         }

         async function executeClearAllData() {
             closeModal('confirm-clear-all-modal');
             console.warn("Attempting to clear all application data!");
             if (!db) { showNotification(translateKey('error_loading') + " (DB Not Ready)", 'error'); return; }

             try {
                 const storeNames = Array.from(db.objectStoreNames);
                 const tx = db.transaction(storeNames, 'readwrite');
                 // Queue clear requests for all stores
                 storeNames.forEach(storeName => {
                      tx.objectStore(storeName).clear();
                 });

                  // Wait for the main transaction to complete
                  await new Promise((resolve, reject) => {
                      tx.oncomplete = resolve;
                      tx.onerror = reject;
                      tx.onabort = reject;
                  });

                 showNotification(translateKey('alert_data_cleared'), 'success');

                  // Re-add default settings (language, password) within a new transaction
                  try {
                      // Use a small timeout to ensure the previous transaction is fully finished? Not strictly needed per spec but safer.
                      setTimeout(async () => {
                           const settingsTx = db.transaction('settings', 'readwrite');
                           const settingsStore = settingsTx.objectStore('settings');
                           await settingsStore.put({ key: 'language', value: 'en' }); // Reset language to English
                            await settingsStore.delete('userPassword'); // Remove the user password key
                           await new Promise((res, rej) => { settingsTx.oncomplete = res; settingsTx.onerror = rej; });
                           console.log("Default settings restored (language reset, password removed).");
                           // Now reload the application state completely by refreshing the page
                           window.location.reload();
                      }, 100); // Small delay

                  } catch (settingsError) {
                      console.error("Error restoring default settings after clear:", settingsError);
                       // Still attempt to reload even if settings restore fails
                      window.location.reload();
                  }


             } catch (error) {
                 console.error("Error clearing all data:", error);
                 showNotification(translateKey('error_deleting') + ` (Clear All: ${error.message || 'Transaction Failed'})`, 'error');
             }
         }


        // --- Event Listeners Setup ---
        function setupEventListeners() {
            // Menu Toggle
            domElements.menuToggle.addEventListener('click', toggleMenu);

            // Navigation Links
            domElements.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const sectionId = link.getAttribute('data-section');
                    navigateToSection(sectionId, link);
                });
            });

            // Language Selection
            domElements.languageSelect.addEventListener('change', (e) => {
                const newLang = e.target.value;
                translateUI(newLang);
                saveLanguagePreference(newLang);
            });

            // Password Prompt
            domElements.submitPasswordBtn.addEventListener('click', handlePasswordSubmit);
            domElements.passwordInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handlePasswordSubmit(); });
             // Close password prompt on 'Escape' key
            domElements.passwordPrompt.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal('password-prompt'); resetPasswordProtection(); } });


            // Item Management
            domElements.addItemBtn?.addEventListener('click', () => openItemModal());
            domElements.itemForm.addEventListener('submit', saveItem);
            domElements.itemSearchInput.addEventListener('input', () => loadItems());

            // Category Management
            domElements.addCategoryBtn?.addEventListener('click', () => openCategoryModal());
            domElements.categoryForm.addEventListener('submit', saveCategory);

            // Purchase Management
            domElements.addPurchaseBtn?.addEventListener('click', () => openPurchaseModal());
            domElements.purchaseForm.addEventListener('submit', savePurchase);

            // Delete Confirmation
            domElements.confirmDeleteYesBtn.addEventListener('click', executeDelete);

            // POS Interface
            domElements.posSearchInput.addEventListener('input', () => {
                 const activeCategoryTab = domElements.categoryTabs.querySelector('.category-tab.active')?.dataset.categoryId || 'all';
                 const categoryId = activeCategoryTab; // Use the active category ID
                 updateProductsGrid(categoryId, domElements.posSearchInput.value);
            });
            domElements.completeTransactionBtn.addEventListener('click', completeTransaction); // Now calls confirmCompleteSale
            domElements.cancelTransactionBtn.addEventListener('click', cancelTransaction);
            // Sale Confirmation Modal (New listeners)
            domElements.confirmSaleYesBtn.addEventListener('click', executeCompleteSale);
            domElements.confirmSaleModal.addEventListener('keydown', (e) => { // Allow closing sale confirm with Escape
                 if (e.key === 'Escape') { closeModal('confirm-sale-modal'); }
             });


            // Report Generation
            domElements.generateDailyReportBtn.addEventListener('click', () => {
                 const dateValue = domElements.dailyReportDateInput.value;
                 if (dateValue) generateReport('daily', dateValue);
                 else showNotification(translateKey('error_invalid_input') + " (Report Date)", 'error');
             });
            domElements.generateMonthlyReportBtn.addEventListener('click', () => {
                 const dateValue = domElements.monthlyReportDateInput.value;
                 if (dateValue) generateReport('monthly', dateValue);
                 else showNotification(translateKey('error_invalid_input') + " (Report Month)", 'error');
             });

             // Settings - Clear All Data
              domElements.clearAllDataBtn?.addEventListener('click', confirmClearAllData);
              domElements.confirmClearAllYesBtn?.addEventListener('click', executeClearAllData);
             domElements.confirmClearAllModal.addEventListener('keydown', (e) => { // Allow closing clear all confirm with Escape
                  if (e.key === 'Escape') { closeModal('confirm-clear-all-modal'); deleteTarget = null; } // Reset target too
             });

             // Settings - Password Settings (NEW)
             domElements.passwordSettingsForm?.addEventListener('submit', savePasswordSettings);


             // Global listeners (e.e.g., close modal on Escape key)
             document.addEventListener('keydown', (e) => {
                 if (e.key === 'Escape') {
                     // Find any active modal and close it
                     const activeModal = document.querySelector('.modal.active');
                     if (activeModal) {
                         // Special handling for password prompt reset
                         if (activeModal.id === 'password-prompt') {
                            resetPasswordProtection();
                         }
                         // Special handling for delete confirmation reset (handled by their specific close functions)
                         // if (activeModal.id === 'confirm-delete-modal' || activeModal.id === 'confirm-clear-all-modal') {
                         //     // Handled by close listeners on those modals
                         // }
                         closeModal(activeModal.id);
                     }
                      // Close side menu if open
                      else if (domElements.sideMenu.classList.contains('active')) {
                         toggleMenu();
                      }
                 }
             });


            // Window Resize for responsive adjustments (Simplified - relies on CSS media queries mainly)
             // The CSS now handles the primary push/overlay logic via media queries.
             // Ensure no inline styles interfere after initial setup.
            window.addEventListener('resize', () => {
                 // If you need JS-based adjustments on resize, add them here.
                 // For now, CSS handles the menu behavior switching points.
                 // Close menu if resizing from small to large screen while menu is open? (Optional UX enhancement)
                 if (window.innerWidth > 768 && domElements.sideMenu.classList.contains('active')) {
                     // toggleMenu(); // Optional: close menu on desktop if open when resizing up
                 }
            });
        }


        // --- Initialization ---
        /**
         * Initializes the application: sets up DB, loads preferences, sets up UI.
         */
        async function initializeApp() {
            console.log("Initializing Application...");
            // Optional: Add a loading indicator
            // document.body.classList.add('loading');

            try {
                await setupDB();
                currentLanguage = await loadLanguagePreference();
                translateUI(currentLanguage); // Apply translations first
                setupEventListeners(); // Then setup listeners

                // Navigate to the default section (Dashboard)
                 const dashboardLink = document.querySelector('.nav-link[data-section="dashboard-section"]');
                 if (dashboardLink) {
                     // Use requestAnimationFrame to ensure initial UI paint is done before loading data
                     requestAnimationFrame(() => {
                         navigateToSection('dashboard-section', dashboardLink);
                     });
                 } else {
                     console.error("Dashboard navigation link not found!");
                     // Fallback: just activate dashboard and load data if link is missing
                     document.getElementById('dashboard-section')?.classList.add('active');
                     await updateDashboardStats();
                 }

                console.log("Application Initialized Successfully.");

            } catch (error) {
                console.error("Failed to initialize application:", error);
                // Display a critical error message on the page if init fails
                document.body.innerHTML = `<div style="padding: 20px; text-align: center; color: red;">
                    <h1>Application Initialization Failed</h1><p>${translateKey('error_loading')}</p><p>${error.message || error}</p></div>`;
            } finally {
                // Optional: Remove loading indicator
                // document.body.classList.remove('loading');
            }
        }

        // Start the application once the DOM is fully loaded
        document.addEventListener('DOMContentLoaded', initializeApp);
