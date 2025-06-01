<template>
  <div class="p-4">
    <!-- Last Updated Time with Refresh Button -->
    <div class="flex items-center mb-4 space-x-4">
      <p v-if="lastUpdated" class="text-sm text-gray-600">
        Last updated: {{ formattedTime }}
      </p>
      <button
        @click="refreshData"
        :disabled="loading"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm px-3 py-1 rounded shadow"
        title="Refresh Stock Data"
      >
        <span v-if="loading">Refreshing...</span>
        <span v-else>Refresh</span>
      </button>
    </div>

    <h1 class="text-2xl font-bold mb-6">Stock Groups</h1>

    <!-- Featured Groups with Logo Only -->
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <div
        v-for="group in featuredGroups"
        :key="group.name"
        @click="goToGroupDetails(group.key)"
        class="cursor-pointer rounded overflow-hidden shadow-md hover:shadow-xl transition duration-300"
      >
        <img
          :src="group.logo"
          :alt="group.name"
          class="w-full h-32 object-contain bg-white"
        />
      </div>
    </div>

    <!-- Other Groups as Text -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="group in otherGroups"
        :key="group.group"
        @click="goToGroupDetails(group.group)"
        class="cursor-pointer bg-white p-4 text-center rounded shadow hover:bg-gray-50 transition"
      >
        <p class="font-medium text-gray-800 text-lg">{{ group.group }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

import paragonLogo from "../assets/group-logos/Paragon.jpg";
import relianceLogo from "../assets/group-logos/Reliance.jpg";
import cubixLogo from "../assets/group-logos/Cubix.jpg";
import florexLogo from "../assets/group-logos/Florex.jpg";

const stockGroups = ref([]);
const lastUpdated = ref("");
const loading = ref(false);
const router = useRouter();

const fetchStockSummary = async () => {
  try {
    const res = await fetch("/stock-summary.json");
    const json = await res.json();
    stockGroups.value = json.data;
    lastUpdated.value = json.lastUpdated;
  } catch (error) {
    console.error("Error fetching stock summary:", error);
  }
};

const refreshData = async () => {
  loading.value = true;
  try {
    // Call your backend API at localhost:9000 to refresh JSON
    const response = await fetch(
      "http://localhost:9000/api/refresh-stock-summary",
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to refresh data");
    }

    // Wait a little bit, then reload the updated JSON file
    await fetchStockSummary();
  } catch (err) {
    console.error(err);
    alert("Failed to refresh data from backend.");
  } finally {
    loading.value = false;
  }
};

const featuredGroupMap = {
  PARAGON: { name: "Paragon", logo: paragonLogo },
  "RELIANCE FOOTWEAR": { name: "Reliance", logo: relianceLogo },
  CUBIX: { name: "Cubix", logo: cubixLogo },
  "Florex (Swastik)": { name: "Florex", logo: florexLogo },
};

const featuredGroups = computed(() =>
  Object.entries(featuredGroupMap).map(([key, { name, logo }]) => ({
    key,
    name,
    logo,
  }))
);

const otherGroups = computed(() =>
  stockGroups.value.filter(
    (group) => !Object.keys(featuredGroupMap).includes(group.group)
  )
);

const goToGroupDetails = (groupName) => {
  router.push({ name: "GroupDetails", params: { groupName } });
};

// Beautified last updated time
const formattedTime = computed(() => {
  if (!lastUpdated.value) return "";
  const date = new Date(lastUpdated.value);
  return date.toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
});

onMounted(() => {
  fetchStockSummary();
});
</script>

<style scoped>
img {
  transition: transform 0.3s ease;
}
img:hover {
  transform: scale(1.05);
}
</style>
