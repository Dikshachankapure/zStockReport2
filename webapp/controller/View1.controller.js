sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"stock/zstockreport/jsondata/InitPage",
	'sap/viz/ui5/format/ChartFormatter',
    'sap/viz/ui5/api/env/Format',
], function (Controller, JSONModel, MessageToast, formatter, Filter, FilterOperator, ChartFormatter, Format, InitPageUtil) {
	"use strict";

	return Controller.extend("stock.zstockreport.controller.View1", {

		

		onInit: function (evt) {

			var oModel = this.getOwnerComponent().getModel("CompanyDataSet");
			this.getView().setModel(oModel, "oModelCompany");

			var oModelQuantity = this.getOwnerComponent().getModel("QuantitySet");
			this.getView().setModel(oModelQuantity, "oModelQty");

			

		},

		onSearch: function (oEvent) {

			var currencyTpe = this.getView().byId("currntype");
			var fiscalYear = this.getView().byId("fiscalyr");
			var rdbtnAmount = this.getView().byId("rdb1");
			var rdbtnQty = this.getView().byId("rdb2");
			var otable = this.getView().byId("table");
			var otableQTY = this.getView().byId("qtytable");
		/*	var oChartAmt = this.getView().byId("idVizFrame");
			var oChartQty = this.getView().byId("idVizFrameQty");
			*/
			
			var oPanelChartAmount = this.getView().byId("settingsPanel");
			var oPanelChartQty = this.getView().byId("settingsPanelQTY");

			var that = this;

			if (currencyTpe.getValue().trim().length === 0) {
				MessageToast.show("plz Select Currency Type");
				return false;
			} else if (fiscalYear.getValue().trim().length === 0) {
				MessageToast.show("Plz Select Fiscal Year");
				return false;

			} else {
				if (this.getView().byId("rdb1").getSelected()) {
					otable.setVisible(true);
					otableQTY.setVisible(false);
					var oModelStock = this.getOwnerComponent().getModel("CompanyDataSet");
					this.getView().setModel(oModelStock);

					// oChartAmt.setVisible(true);
					oPanelChartAmount.setVisible(true);
						oPanelChartQty.setVisible(false);
					// oChartQty.setVisible(false);
					that.onPressChartByAmount();
					/*var oModelChart = this.getOwnerComponent().getModel("ChartDataSet");
					this.getView().setModel(oModelChart);*/

				} else if (this.getView().byId("rdb2").getSelected()) {

					otableQTY.setVisible(true);
					otable.setVisible(false);
					var oModelStockqty = this.getOwnerComponent().getModel("QuantitySet");
					this.getView().setModel(oModelStockqty);
					
						oPanelChartQty.setVisible(true);
							oPanelChartAmount.setVisible(false);
					/*oChartQty.setVisible(true);
					oChartAmt.setVisible(false);
*/
					that.onPressChartByQty();
					/*var oModelChartAmt = this.getOwnerComponent().getModel("ChartDataSet");
					this.getView().setModel(oModelChartAmt);*/
				}

			}

		},

		
		onPressChartByAmount: function () {
			Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;
			var oModelChart = this.getOwnerComponent().getModel("ChartDataSet");
			this.getView().setModel(oModelChart);

			var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
			oVizFrame.setVizProperties({
				plotArea: {
					dataLabel: {
						formatString: formatPattern.SHORTFLOAT_MFD2,
						visible: true
					}
				},
				valueAxis: {
					label: {
						formatString: formatPattern.SHORTFLOAT
					},
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				},
				title: {
					visible: true,
					text: 'Stock Report by Amount'
				}
			});

			
			var oPopOver = this.getView().byId("idPopOver");
			oPopOver.connect(oVizFrame.getVizUid());
			oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
			
		//	InitPageUtil.initPageSettings(this.getView());
		},

		onPressChartByQty: function () {

Format.numericFormatter(ChartFormatter.getInstance());
            var formatPattern = ChartFormatter.DefaultPattern;
			var oModelChart = this.getOwnerComponent().getModel("ChartDataSet");
			this.getView().setModel(oModelChart);

			var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrameQty");
			oVizFrame.setVizProperties({
				plotArea: {
					dataLabel: {
						formatString: formatPattern.SHORTFLOAT_MFD2,
						visible: true
					}
				},
				valueAxis: {
					label: {
						formatString: formatPattern.SHORTFLOAT
					},
					title: {
						visible: false
					}
				},
				categoryAxis: {
					title: {
						visible: false
					}
				},
				title: {
					visible: true,
					text: 'Stock Report by Quantity'
				}
			});

			
			var oPopOver = this.getView().byId("idPopOverQty");
			oPopOver.connect(oVizFrame.getVizUid());
			oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
			
		//	InitPageUtil.initPageSettings(this.getView());
		},


	

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onPress: function (oEvent) {
			//	var Stock =	sap.ui.getCore().getModel("oModel").getProperty();
			if (this.getView().byId("rdb1").getSelected()) {
				var Stock = oEvent.getSource().getBindingContext("oModelCompany").getObject();

				this.getRouter().navTo("storage", {
					Company: Stock.Company,
					Type: Stock.Type

				});
			} else if (this.getView().byId("rdb2").getSelected()) {

				var Stock = oEvent.getSource().getBindingContext("oModelQty").getObject();

				this.getRouter().navTo("storage", {
					Company: Stock.Company,
					Type: Stock.Type
				});
			}

		},

		/*onPressQTY: function (oEvent) {
			//	var Stock =	sap.ui.getCore().getModel("oModel").getProperty();
			var Stock = oEvent.getSource().getBindingContext("oModelQty").getObject();

			this.getRouter().navTo("storage", {
				Company: Stock.Company
			});

		},*/

		_handleValueCurrencyType: function (oEvent) {

			var oModelCurrencyTpe = this.getOwnerComponent().getModel("CurrencyDataSet");
			this.getView().setModel(oModelCurrencyTpe);

			var sInputValuecurrencytype = oEvent.getSource().getValue();

			this.inputCurrencyId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogCurrencyType) {
				this._valueHelpDialogCurrencyType = sap.ui.xmlfragment(
					"stock.zstockreport.fragments.currency", //id.fragments.file.name ---take id from manifest.json
					this
				);
				this.getView().addDependent(this._valueHelpDialogCurrencyType);
			}

			// create a filter for the binding

			this._valueHelpDialogCurrencyType.getBinding("items").filter([new sap.ui.model.Filter(
				"currency",
				sap.ui.model.FilterOperator.Contains, sInputValuecurrencytype
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogCurrencyType.open(sInputValuecurrencytype);
		},
		_handleValueHelpSearchcurrency: function (evt) {
			var sValueCurrencyType = evt.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"currency",
				sap.ui.model.FilterOperator.Contains, sValueCurrencyType
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpClosecurrency: function (evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			if (oSelectedItem) {
				var CurrencyTypeInput = this.getView().byId(this.inputCurrencyId);
				CurrencyTypeInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
		},

	});
});