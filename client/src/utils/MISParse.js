// misHelpers.js

// Map of branch codes to their names
const BRANCH_CODES = {
    // '01': 'Civil Engineering',
    // '02': 'Mechanical Engineering',
    '03': 'Computer Engineering',
    // '04': 'Electrical Engineering',
    // '05': 'Electronics Engineering',
    // '06': 'Information Technology'
};

// Map of years to current semesters (as of 2024)
const SEMESTER_MAP = {
    '22': 6,
    '23': 4,
    '24': 2
};

/**
 * Parses a MIS number and returns extracted information
 * @param {string} mis - The MIS number to parse
 * @returns {Object} An object containing the parsed information or error
 */
export const parseMIS = (mis) => {
    try {
        // Basic validation
        if (!mis || typeof mis !== 'string') {
            throw new Error('MIS must be a string');
        }

        // Check MIS format using regex
        const misPattern = /^61(\d{2})(0[1-6])(\d{3})$/;
        const matches = mis.match(misPattern);

        if (!matches) {
            throw new Error('Invalid MIS format. MIS should be 9 digits starting with 61');
        }

        const [_, year, branchCode, rollNumber] = matches;

        // Validate year
        if (!SEMESTER_MAP.hasOwnProperty(year)) {
            throw new Error(`Invalid year in MIS. Only years ${Object.keys(SEMESTER_MAP).join(', ')} are valid`);
        }

        // Get branch name
        const branchName = BRANCH_CODES[branchCode];
        if (!branchName) {
            throw new Error('Invalid branch code');
        }

        // Return parsed information
        return {
            success: true,
            data: {
                year: `20${year}`,
                branch: branchName,
                branchCode,
                semester: SEMESTER_MAP[year],
                rollNumber,
                fullMIS: mis
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Validates if a string is a valid MIS number
 * @param {string} mis - The MIS number to validate
 * @returns {boolean} True if MIS is valid
 */
export const isValidMIS = (mis) => {
    const result = parseMIS(mis);
    return result.success;
};

/**
 * Gets the branch name from a branch code
 * @param {string} code - The branch code
 * @returns {string|null} Branch name or null if invalid
 */
export const getBranchName = (code) => {
    return BRANCH_CODES[code] || null;
};

/**
 * Gets current semester based on MIS year
 * @param {string} year - Last two digits of year (e.g., "22")
 * @returns {number|null} Semester number or null if invalid
 */
export const getSemester = (year) => {
    return SEMESTER_MAP[year] || null;
};

// Example usage:
/*
const result = parseMIS('612203001');
if (result.success) {
  const { year, branch, semester, rollNumber } = result.data;
  console.log(`Student is in ${semester}th semester of ${branch}, admitted in ${year}`);
} else {
  console.error(result.error);
}
*/