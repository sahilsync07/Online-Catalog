<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="flex items-center justify-between mb-6">
      <button
        @click="$router.back()"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        ← Back
      </button>
      <h1 class="text-2xl font-bold text-gray-800">Group: {{ groupName }}</h1>
      <div></div>
    </div>

    <div v-if="!groupDetails.length" class="text-center text-gray-600">
      Loading group details or no items found...
    </div>
    <div v-else class="overflow-x-auto bg-white rounded-xl shadow p-4">
      <table class="min-w-full table-auto">
        <thead class="bg-gray-200 text-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">Item</th>
            <th class="px-4 py-2 text-left">Quantity</th>
            <th class="px-4 py-2 text-left">Rate</th>
            <th class="px-4 py-2 text-left">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in groupDetails"
            :key="item.name"
            class="border-t hover:bg-gray-50 transition"
          >
            <td class="px-4 py-2 font-medium text-gray-900">{{ item.name }}</td>
            <td class="px-4 py-2 text-gray-600">{{ item.quantity }}</td>
            <td class="px-4 py-2 text-gray-600">
              ₹{{ formatNumber(item.rate) }}
            </td>
            <td class="px-4 py-2 text-gray-800 font-semibold">
              ₹{{ formatNumber(item.amount) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const groupName = route.params.groupName;
const groupDetails = ref([]);

const fetchGroupDetails = async () => {
  try {
    const res = await fetch("/stock-summary.json");
    if (!res.ok)
      throw new Error(`Failed to fetch stock summary: ${res.statusText}`);
    const json = await res.json();
    if (!json.data || !Array.isArray(json.data)) {
      throw new Error("Invalid stock summary format");
    }
    const groupData = json.data.find(
      (group) => group.group.toLowerCase() === groupName.toLowerCase()
    );
    groupDetails.value = groupData ? groupData.items : [];
  } catch (error) {
    console.error("Error fetching group details:", error.message);
    alert(`Error loading group details: ${error.message}`);
  }
};

const formatNumber = (num) => {
  return Number(num).toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

onMounted(() => {
  fetchGroupDetails();
});
</script>

<style scoped>
/* Optional scoped styles */
</style>
